import { Task } from "./tasks";

export interface Project {
    id: string;
    name: string;
    description: string;
    tasks: Task[];
    }

export interface GetProjects {
    projects: Project[];
}