import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_TASK } from "@/utils/graphql/mutations/tasks";
import { Task, TaskStatus } from "@/types/tasks";
import { Dialog } from "@mui/material";
import { handleShowStatus } from "@/utils/helpers";
import useMiddleware from "@/hooks/useMiddleware";
import { AllUsers, Role } from "@/types/users";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";
import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { LoadingSkeleton } from "./loadinSkeleton";

interface EditTaskPopupProps {
  open: boolean;
  task: Task;
  setOpen: (open: boolean) => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({
  open,
  task: { id, title, description, status, dueDate, assignee },
  setOpen,
}) => {
  const user = useMiddleware(Role.USER);
  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK, {
    update(cache, { data: { updateTask } }) {
      cache.modify({
        fields: {
          tasks(existingTasks = []) {
            return existingTasks.map((task: Task) =>
              task.id === updateTask.id ? updateTask : task
            );
          },
        },
      });
    },
  });

  const { data, loading: loadingUsers } =
    useQuery<AllUsers>(GET_ALL_USERS_QUERY);
  const router = useRouter();
  const { id: projectId } = router.query;
  const users = data?.users || [];
  const [isAdmin, setIsAdmin] = useState(false);

  const possibleStatus = ["PENDING", "IN_PROGRESS", "COMPLETED"];

  const filteredUsers = users.filter((user) => user.id !== assignee?.id);

  const formatDueDate = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp, 10)); // Asegúrate de convertir el string a número
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`; // Formato requerido
  };

  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      setIsAdmin(true);
    }
  }, [user]);

  if (loadingUsers) return <LoadingSkeleton />;

  //remove the current status from the possible status
  const filteredStatus = possibleStatus.filter((s) => s !== status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const { newTitle, newDescription, newStatus, newDueDate, newAssignee } =
      data;
    setOpen(false);

    const { data: success, errors } = await updateTask({
      variables: {
        id,
        title: newTitle as string,
        description: newDescription as string,
        status: newStatus as TaskStatus,
        dueDate: new Date(newDueDate as string),
        assigneeId: newAssignee ? parseInt(newAssignee as string) : null,
      },
      refetchQueries: [
        {
          query: GET_TASKS_BY_PROJECT,
          variables: { projectId },
        },
      ],
      awaitRefetchQueries: true,
    });
    if (success) {
      toast.success("👍🏻");
      setOpen(false);
    }
    if (errors) {
      toast.error("Error al actualizar la tarea");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 flex flex-col rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Tarea
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {isAdmin ? (
            <>
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="block text-gray-700 font-medium">
                  Título
                </Label>
                <Input
                  id="newTitle"
                  name="newTitle"
                  defaultValue={title}
                  disabled={!isAdmin}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="block text-gray-700 font-medium">
                  Descripción
                </Label>
                <Textarea
                  id="newDescription"
                  name="newDescription"
                  defaultValue={description}
                  disabled={!isAdmin}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="assignee"
                  className="block text-gray-700 font-medium">
                  Asignado a
                </Label>
                <select
                  name="newAssignee"
                  id="newAssignee"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-800"
                  disabled={!isAdmin}>
                  <option value={assignee?.id || ""}>
                    {assignee?.name || "Sin asignar"}
                  </option>
                  {filteredUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}

          {/* Campo común para todos los usuarios */}
          <div className="space-y-3">
            <Label htmlFor="status" className="block text-gray-700 font-medium">
              Estado
            </Label>
            <select
              id="newStatus"
              name="newStatus"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none">
              <option value={status}>{handleShowStatus(status)}</option>
              {filteredStatus.map((status) => (
                <option key={status} value={status}>
                  {handleShowStatus(status as TaskStatus)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {isAdmin && (
              <Label
                htmlFor="dueDate"
                className="block text-gray-700 font-medium">
                Fecha de vencimiento
              </Label>
            )}
            {isAdmin && (
              <Input
                id="newDueDate"
                type="datetime-local"
                name="newDueDate"
                defaultValue={formatDueDate(dueDate)}
                disabled={!isAdmin}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
              {loading ? "Actualizando..." : "Actualizar Tarea"}
            </Button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-4">{error.message}</p>}
      </div>
    </Dialog>
  );
};

export default EditTaskPopup;
