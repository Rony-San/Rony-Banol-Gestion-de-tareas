import useMiddleware from "@/hooks/useMiddleware";
import { GetProjects, Project } from "@/types/projects";
import { Role } from "@/types/users";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useQuery } from "@apollo/client";
import { ProjectCard } from "@/molecules/projectCard";
import { useEffect, useState } from "react";
import { Alert, Button } from "@mui/material";
import { LoadingSkeleton } from "./loadinSkeleton";

export const ProjectData = () => {
  const { data, error, loading } = useQuery<GetProjects>(GET_PROJECTS);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null
  );
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const projects = data?.projects || [];

  const user = useMiddleware(Role.USER);

  useEffect(() => {
    if (user?.role === Role.USER && data?.projects) {
      const userProjects = projects.filter((project) =>
        project.tasks.some((task) => task.assignee?.id === user.id)
      );
      setFilteredProjects(userProjects);
    }
  }, [data, user]);

  if (loading) return <LoadingSkeleton count={3} />;

  if (error) return <p>Error al cargar proyectos: {error.message}</p>;

  if (!user || !projects) {
    return <LoadingSkeleton count={3} />;
  }

  const handleToggleExpand = (projectId: string) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
  };

  return (
    <div className="space-y-4 ">
      {user?.role === Role.USER && filteredProjects.length === 0 && (
        <Alert severity="info">No tienes proyectos asignados</Alert>
      )}

      {(user?.role === Role.ADMIN ? projects : filteredProjects).map(
        (project) => (
          <div
            key={project.id}
            className="flex flex-col border-b border-gray-200 p-3 hover:bg-gray-50 transition">
            {/* Información breve del proyecto (oculta si está expandido) */}
            {expandedProjectId !== project.id && (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {project.tasks.length} tareas en total
                  </p>
                </div>
                <Button onClick={() => handleToggleExpand(project.id)}>
                  Ver más
                </Button>
              </div>
            )}

            {/* Mostrar detalles si está expandido */}
            {expandedProjectId === project.id && (
              <div className="w-full">
                <Button
                  className="mb-3 self-end"
                  onClick={() => handleToggleExpand(project.id)}>
                  Ver menos
                </Button>
                <ProjectCard project={project} />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};
