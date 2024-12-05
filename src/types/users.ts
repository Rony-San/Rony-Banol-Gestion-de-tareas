export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface AllUsers {
    users: User[];
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}