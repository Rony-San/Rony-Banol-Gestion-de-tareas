import { Card, CardFooter } from "@/components/ui/card";
import { Project } from "@/types/projects";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";
import { useEffect, useState } from "react";
import DeleteProjectPopup from "@/molecules/deleteProjectPopup";
import EditProjectPopup from "@/molecules/editProjectPopup";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const user = useMiddleware(Role.USER);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Comprobar si el usuario es administrador
  useEffect(() => {
    setIsAdmin(user?.role === Role.ADMIN);
  }, [user]);

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div>
      <Card className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        {/* Header del proyecto */}
        <div className="bg-gray-50 shadow-md flex justify-between px-5 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
          </div>
          <Link
            href={{
              pathname: "/admin/tasks/[id]",
              query: { id: project.id },
            }}
            className="text-sm font-medium  text-teal-600 hover:text-orange-800 hover:underline transition">
            Más información
          </Link>
        </div>

        {/* Descripción del proyecto */}
        <div className="p-5">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            {project.description ||
              "No hay descripción disponible para este proyecto."}
          </p>

          {/* Barra de progreso */}
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Progreso: {completedTasks} / {totalTasks} tareas completadas
            </p>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-teal-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <CardFooter className="bg-gray-50 px-5 py-4 flex justify-end space-x-3">
          {isAdmin && (
            <>
              <Button
                onClick={() => setOpenEdit(true)}
                className="flex items-center justify-center p-2 border border-blue-500 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">
                Editar
              </Button>
              <Button
                onClick={() => setOpenDelete(true)}
                className="flex items-center justify-center p-2 border border-red-500 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition">
                Eliminar
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Popups */}
      <DeleteProjectPopup
        open={openDelete}
        setOpen={setOpenDelete}
        project={project}
      />
      <EditProjectPopup
        open={openEdit}
        setOpen={setOpenEdit}
        project={project}
      />
    </div>
  );
};
