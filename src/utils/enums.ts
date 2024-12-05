export enum PaymentType {
    CASH = "CASH",
    CARD = "CARD",
    OTHER = "OTHER"
}

export interface UserProps {
    id: string,
    name: string,
    email: string,
    role: Role,
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

export enum MiddlewareError {
    UNAUTHORIZED = "UNAUTHORIZED"
}

export const states: { [key: string]: string } = {ready: "Listo", preparing: "Preparando", delivered: "Entregado", pending: "Pendiente"}

