import { TaskStatus } from "@/types/tasks";

export const handleShowStatus = (status: TaskStatus) => {
    switch (status) {
        case "PENDING":
            return "Pendiente";
        case "IN_PROGRESS":
            return "En Progreso";
        case "COMPLETED":
            return "Completada";
        default:
            return "No especificado";
    }
}