import { PrismaClient, User } from "@prisma/client";
import {GraphQLContext} from "@/lib/context";
import { IncomingMessage } from "http";
import prisma from "../../lib/prisma";
import {Role} from "@/utils/enums";


export async function authenticateUser(prisma: PrismaClient, request: IncomingMessage): Promise<User | null> {
    if (request?.headers?.authorization) {
        const token = request.headers.authorization.split(" ")[1];

        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });

        if (session && session.expiresAt > new Date()) {
            return session.user;
        } else {
            if (session) {
                await prisma.session.delete({
                    where: { token },
                });
            }
            return null;
        }
    }
    return null;
}

export function requireAuth(context: GraphQLContext, role: Role) {
    if (!context.currentUser) {
        throw new Error("You must be authenticated");
    }
    if (role === Role.ADMIN && context.currentUser.role !== Role.ADMIN) {
        throw new Error("You must be an admin");
    }
}

export async function logout(context: GraphQLContext) {
    if (context.currentUser) {
        return prisma.session.deleteMany({
            where: { userId: context.currentUser.id },
        });
    }
    return null;
}