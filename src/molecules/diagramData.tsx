import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Project } from "@/types/projects";
import { Task } from "@/types/tasks";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert } from "@mui/material";
import { LoadingSkeleton } from "./loadinSkeleton";

export const BarData = () => {
  const { data, loading: projectsLoading } = useQuery(GET_PROJECTS);
  const projects = data?.projects || [];
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  const generateRandomColor = () => {
    // Genera un color aleatorio en formato HSL
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60; // 60% - 100%
    const lightness = Math.floor(Math.random() * 30) + 50; // 50% - 80%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Filtrar los proyectos según el proyecto seleccionado
  const filteredProjects: Project[] =
    selectedProjectId === "all"
      ? projects
      : projects.filter((project: Project) => project.id === selectedProjectId);

  // Generar chartData y chartConfig a partir de los proyectos
  const chartData: { name: string; totalCompleted: number; fill: string }[] =
    [];
  const chartConfig: ChartConfig = {};

  filteredProjects.forEach((project: Project) => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (task: Task) => task.status === "COMPLETED"
    ).length;
    const completedPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const color = generateRandomColor();

    chartData.push({
      name: project.name, // Nombre del proyecto
      totalCompleted: completedPercentage, // Porcentaje de tareas completadas
      fill: color, // Color aleatorio
    });

    chartConfig[project.name] = {
      label: project.name,
    };
  });
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>% tareas completadas por proyecto</CardTitle>
        <CardDescription> histórico</CardDescription>
      </CardHeader>
      <CardContent className="m-5">
        {projectsLoading && <LoadingSkeleton />}
        <Select onValueChange={setSelectedProjectId} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los proyectos</SelectItem>
            {projects.map((project: Project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filteredProjects.length === 1 &&
        filteredProjects[0].tasks.length === 0 ? (
          <Alert severity="info" className="m-3">
            No hay tareas que mostrar
          </Alert>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 0,
              }}>
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) =>
                  String(
                    chartConfig[value as keyof typeof chartConfig]?.label || ""
                  )
                }
              />
              <XAxis dataKey="totalCompleted" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="totalCompleted" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col tems-center justify-center  gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none i">
          % Tareas completadas por proyecto
        </div>
        <div className="leading-none text-muted-foreground">
          <TrendingUp size={16} className="mr-1" />
        </div>
      </CardFooter>
    </Card>
  );
};
