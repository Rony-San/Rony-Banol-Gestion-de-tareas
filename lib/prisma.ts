import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }
  prisma = global.prisma;
}
export default prisma;
