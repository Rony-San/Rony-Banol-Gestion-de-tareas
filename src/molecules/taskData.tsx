import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Task, TaskByProject } from "@/types/tasks";
import { TaskCard } from "./taskCard";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";
import { Alert, Button } from "@mui/material";
import { LoadingSkeleton } from "./loadinSkeleton";

interface TaskDataProps {
  id: string; // ID del proyecto
}

const TaskData: React.FC<TaskDataProps> = ({ id }) => {
  const user = useMiddleware(Role.USER);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Consulta GraphQL para obtener las tareas del proyecto
  const { data, loading, error } = useQuery<TaskByProject>(
    GET_TASKS_BY_PROJECT,
    {
      variables: { projectId: id },
    }
  );

  useEffect(() => {
    // Filtra las tareas asignadas al usuario si tiene el rol USER
    if (user?.role === Role.USER && data?.tasksByProject) {
      const userTasks = data.tasksByProject.filter(
        (task) => task.assignee?.id === user.id
      );
      setFilteredTasks(userTasks);
    }
  }, [data, user]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <p>Error al cargar tareas: {error.message}</p>;

  const tasks = data?.tasksByProject || []; // Lista completa de tareas

  const handleToggleExpand = (taskId: string) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  return (
    <div className="space-y-4">
      {/* Mensaje si no hay tareas */}
      {user?.role === Role.USER && filteredTasks.length === 0 && (
        <Alert severity="info">No tienes tareas asignadas</Alert>
      )}
      {user?.role === Role.ADMIN && tasks.length === 0 && (
        <Alert severity="info">Aún no hay tareas para este proyecto</Alert>
      )}

      {/* Renderiza las tareas como una lista */}
      {(user?.role === Role.ADMIN ? tasks : filteredTasks).map((task) => (
        <div
          key={task.id}
          className="flex flex-col border-b border-gray-200 p-3 hover:bg-gray-50 transition">
          {/* Vista breve de la tarea */}
          {expandedTaskId !== String(task.id) && (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Asignado a: {task.assignee?.name || "Sin asignar"}
                </p>
              </div>
              <Button onClick={() => handleToggleExpand(String(task.id))}>
                Ver más
              </Button>
            </div>
          )}

          {/* Detalles completos de la tarea */}
          {expandedTaskId === String(task.id) && (
            <div className="w-full">
              <Button
                className="mb-3 self-end"
                onClick={() => handleToggleExpand(String(task.id))}>
                Ver menos
              </Button>
              <TaskCard task={task} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskData;
