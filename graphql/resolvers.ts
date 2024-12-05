import prisma from "../lib/prisma";
import { GraphQLContext } from "@/lib/context";
import { compare, genSaltSync, hash, hashSync } from "bcryptjs";
import { logout, requireAuth } from "@/lib/auth";
import { Role } from "@/utils/enums";
import { TaskStatus } from "@prisma/client";

const generateRandomKey = (length: number = 64): string => {
    const salt = genSaltSync(10);
    const hash = hashSync(salt, 10);
    return hash.slice(0, length);
};

const createDateOneDayLater = (): Date => {
    const now = new Date();
    const oneDayLater = new Date(now);
    oneDayLater.setDate(now.getDate() + 1);
    return oneDayLater;
};

const createSession = async (userId: number): Promise<string> => {
    const token = generateRandomKey(64);
    const storedToken = await prisma.session.create({
        data: {
            token,
            userId,
            expiresAt: createDateOneDayLater(),
        },
        include: { user: true },
    });

    return storedToken.token;
};

export const resolvers = {
    Query: {
        me: (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            return context.currentUser;
        },
        users: async (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.user.findMany();
        },
        user: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.user.findUnique({
                where: { id: Number(id) },
            });
        },
        projects: async () => {
            return prisma.project.findMany({
                include: {
                    tasks: {
                        include: {
                            assignee: true,
                        },
                    }, owner: true
                },
            });
        },
        project: async (parent: unknown, { id }: { id: string }) => {
            return prisma.project.findUnique({
                where: { id: Number(id) },
                include: {
                    tasks: {
                        include: {
                            assignee: true,
                        },
                    }, owner: true
                },
            });
        },
        tasks: async () => {
            return prisma.task.findMany({
                include: { project: true, assignee: true },
            });
        },
        task: async (parent: unknown, { id }: { id: string }) => {
            return prisma.task.findUnique({
                where: { id: Number(id) },
                include: { project: true, assignee: true },
            });
        },
        // Resolver para obtener todas las tareas de un proyecto
        tasksByProject: async (parent: unknown, { projectId }: { projectId: string }, context: GraphQLContext) => {
            // Verifica que el usuario esté autenticado si es necesario
            return await context.prisma.task.findMany({
                where: {
                    projectId: Number(projectId),
                },
                include: {
                    assignee: true, // Incluye datos del usuario asignado (opcional)
                    project: true,  // Incluye datos del proyecto (opcional)
                },
            });
        },
    },
    Mutation: {
        signup: async (
            parent: unknown,
            args: { email: string; password: string; name: string, role: Role },
            context: GraphQLContext
        ) => {
            requireAuth(context, Role.ADMIN);
            const password = await hash(args.password, 10);

            const user = await context.prisma.user.create({
                data: { ...args, password },
            });

            const sessionToken = await createSession(user.id);

            return {
                sessionToken,
                user,
            };
        },
        login: async (
            parent: unknown,
            args: { email: string; password: string },
            context: GraphQLContext
        ) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email },
            });
            if (!user) {
                throw new Error("No such user found");
            }

            const valid = await compare(args.password, user.password);
            if (!valid) {
                throw new Error("Invalid password");
            }

            const userId = user.id;

            const sessionToken = await createSession(userId);

            return {
                token: sessionToken,
                user,
            };
        },
        updateUser: async (parent: unknown, { id, name, email, password, role }: { id: string, name?: string, email?: string, password?: string, role?: Role }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            const data: Record<string, unknown> = {};
            if (name) {
                data.name = name;
            }
            if (email) {
                data.email = email;
            }
            if (role) {
                data.role = role;
            }
            if (password) {
                data.password = await hash(password, 10);
            }
            return prisma.user.update({
                where: { id: Number(id) },
                data,
            });
        },
        deleteUser: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.$transaction(async (prisma) => {
                // Supprimer les sessions associées à l'utilisateur
                await prisma.session.deleteMany({
                    where: { userId: Number(id) },
                });

                // Supprimer l'utilisateur
                return prisma.user.delete({
                    where: { id: Number(id) },
                });
            });
        },
        logout: async (parent: unknown, args: {}, context: GraphQLContext) => {
            await logout(context);
            return true;
        },
        createProject: async (parent: unknown, { name, description }: { name: string, description: string }, context: GraphQLContext) => {
            if (!context.currentUser) {
                throw new Error("User not authenticated");
            }
            const userId = context.currentUser.id;
            return prisma.project.create({
                data: {
                    name,
                    description,
                    ownerId: userId,
                },
            });
        },
        deleteProject: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            // Eliminar las tareas relacionadas con el proyecto antes de eliminar el proyecto
            await context.prisma.task.deleteMany({
                where: { projectId: Number(id) },
            });

            // Eliminar el proyecto
            return context.prisma.project.delete({
                where: { id: Number(id) },
            });
        },
        updateProject: async (parent: unknown, { id, name, description }: { id: string, name?: string, description?: string }, context: GraphQLContext) => {
            return context.prisma.project.update({
                where: { id: Number(id) },
                data: {
                    ...(name && { name }),
                    ...(description && { description }),
                },
            });
        },
        createTask: async (parent: unknown, { title, description, status, dueDate, projectId, assigneeId }: { title: string, description: string, status: TaskStatus, dueDate?: string, projectId?: string, assigneeId?: string }) => {
            return prisma.task.create({
                data: {
                    title,
                    description,
                    status,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    projectId: projectId ? Number(projectId) : null,
                    assigneeId: assigneeId ? Number(assigneeId) : null,
                },
            });
        },
        deleteTask: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            return context.prisma.task.delete({
                where: { id: Number(id) },
            });
        },
        updateTask: async (parent: unknown, { id, title, description, status, dueDate, assigneeId }: { id: string, title?: string, description?: string, status?: TaskStatus, dueDate?: string, assigneeId?: string }, context: GraphQLContext) => {
            return context.prisma.task.update({
                where: { id: Number(id) },
                data: {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(status && { status }),
                    ...(dueDate && { dueDate: new Date(dueDate) }),
                    ...(assigneeId && { assigneeId: Number(assigneeId) }),
                },
                include: { assignee: true },
            });
        },
    },
};
