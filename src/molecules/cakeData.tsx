import { GET_PROJECTS } from "@/utils/graphql/queries/projects";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Pie, PieChart, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/projects";
import { Task } from "@/types/tasks";
import { TaskStatus } from "@/types/tasks";
import { LoadingSkeleton } from "./loadinSkeleton";

export const DonutData = () => {
  const { data: projectsData, loading: projectsLoading } =
    useQuery(GET_PROJECTS);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    "all"
  );

  const projectTasks = useMemo(() => {
    if (!projectsData) return [];

    if (selectedProjectId === "all") {
      return projectsData.projects.flatMap((project: Project) => project.tasks);
    } else {
      const selectedProject = projectsData.projects.find(
        (project: Project) => project.id === selectedProjectId
      );
      return selectedProject ? selectedProject.tasks : [];
    }
  }, [selectedProjectId, projectsData]);

  const taskCounts = useMemo(() => {
    const counts = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };
    projectTasks.forEach((task: Task) => {
      counts[task.status as keyof typeof TaskStatus]++;
    });
    return counts;
  }, [projectTasks]);

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60;
    const lightness = Math.floor(Math.random() * 30) + 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const chartData = [
    {
      name: "Pendiente",
      value: taskCounts.PENDING,
      color: generateRandomColor(),
    },
    {
      name: "En proceso",
      value: taskCounts.IN_PROGRESS,
      color: generateRandomColor(),
    },
    {
      name: "Completado",
      value: taskCounts.COMPLETED,
      color: generateRandomColor(),
    },
  ];

  return (
    <Card className="flex flex-col my-4">
      <div className="flex-col items-start space-y-5 justify-center  py-6 pl-6">
        <CardTitle>Estado de Tareas</CardTitle>
        <div className="self-start">Selecciona un proyecto</div>
      </div>
      <CardContent className="flex flex-col gap-4 items-center">
        {/* Dropdown para seleccionar proyecto */}
        {projectsLoading ? (
          <LoadingSkeleton />
        ) : (
          <Select onValueChange={setSelectedProjectId} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              {projectsData?.projects.map((project: Project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Gráfico de Tareas */}
        {projectTasks.length > 0 ? (
          <>
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </>
        ) : (
          <p>Aún no hay tareas asignadas a este proyecto</p>
        )}
      </CardContent>
    </Card>
  );
};
