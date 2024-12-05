
export interface Task {
    id: number,       
    title: string,
    assignee: {
        id: string,
        name: string,
    },
    description: string,
    status: TaskStatus 
    dueDate: string,
    projectId: number,
    createdAt: string,
    updatedAt: string,
}

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

export interface TaskByProject {
    tasksByProject: [Task]
}