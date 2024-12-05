import { PrismaClient, User } from "@prisma/client";
import prisma from "../../lib/prisma";
import { IncomingMessage } from "http";
import { authenticateUser } from "./auth";

export type GraphQLContext = {
    prisma: PrismaClient;
    currentUser: User | null;
};

export async function contextFactory(
    req: IncomingMessage
): Promise<GraphQLContext> {
    return {
        prisma,
        currentUser: await authenticateUser(prisma, req),
    };
}
