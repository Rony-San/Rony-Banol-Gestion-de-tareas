import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TASK } from "@/utils/graphql/mutations/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TaskStatus } from "@/types/tasks";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";
import { AllUsers, Role } from "@/types/users";
import useMiddleware from "@/hooks/useMiddleware";
import AdminLayout from "@/layouts/_layout";
import { IsLoading } from "@/molecules/isLoading";
import { Undo2 } from "lucide-react";
import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

const CreateTaskPage: React.FC = () => {
  const user = useMiddleware(Role.ADMIN);
  const router = useRouter();
  const { id } = router.query;
  const [openInfo, setOpenInfo] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [createTask, { loading }] = useMutation(CREATE_TASK);
  const { data } = useQuery<AllUsers>(GET_ALL_USERS_QUERY);
  const users = data?.users || [];

  const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const title = data.title as string;
    const description = data.description as string;
    const assignee = data.assignee as string;
    const dueDate = new Date(data.dueDate as string);

    const { data: result, errors } = await createTask({
      variables: {
        assigneeId: assignee,
        title,
        description,
        status: TaskStatus.PENDING,
        dueDate,
        projectId: id,
      },
      refetchQueries: [
        {
          query: GET_TASKS_BY_PROJECT,
          variables: { projectId: id },
        },
      ],
    });

    if (result) {
      setOpenInfo(true);
    }

    if (errors) {
      setOpenInfo(true);
      setOpenError(true);
    }
  };

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
        <Button
          variant="secondary"
          className="mt-4 mb-6 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={handleBack}>
          <Undo2 /> Regresar
        </Button>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Crear Tarea
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-800">
              Título de la tarea
            </Label>
            <Input
              id="title"
              type="text"
              name="title"
              placeholder="Ingresa el título"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <Label
              htmlFor="assignee"
              className="text-sm font-medium text-gray-800">
              Asignado a:
            </Label>
            <select
              name="assignee"
              id="assignee"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-500">
              <option value="" className="">
                Seleccionar la persona responsable de esta tarea
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-800">
              Descripción
            </Label>
            <Textarea
              id="description"
              placeholder="Añadir una descripción"
              name="description"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <Label
              htmlFor="dueDate"
              className="text-sm font-medium text-gray-800">
              Fecha de vencimiento
            </Label>
            <Input
              id="dueDate"
              type="datetime-local"
              name="dueDate"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className={`py-3 px-6 rounded-lg font-semibold text-white shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}>
              {loading ? "Creando..." : "Crear Tarea"}
            </Button>
          </div>
        </form>

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={openInfo}
          autoHideDuration={3000}
          onClose={() => setOpenInfo(false)}
          key={"bottomright"}>
          {openError ? (
            <Alert severity="error" variant="filled">
              Error al crear la tarea
            </Alert>
          ) : (
            <Alert severity="success" variant="filled">
              Tarea creada exitosamente
            </Alert>
          )}
        </Snackbar>
      </div>
    </AdminLayout>
  );
};

export default CreateTaskPage;
