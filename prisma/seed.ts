import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("admin", 10);
  const userPassword = await hash("user", 10);

  // Crear usuarios
  await prisma.user.createMany({
    data: [
      {
        name: "admin",
        email: "admin1@admin.com",
        password: adminPassword,
        role: "ADMIN",
      },
      {
        name: "user",
        email: "user1@user.com",
        password: userPassword,
        role: "USER",
      },
    ],
  });
}
//   // Crear proyecto inicial
//   const project = await prisma.project.create({
//     data: {
//       name: "Website Redesign",
//       description: "Redesign the company website for better user experience.",
//       ownerId: 2, // El ID del usuario administrador
//     },
//   });

//   // Crear tareas iniciales asociadas al proyecto
//   const tasks = await prisma.task.createMany({
//     data: [
//       {
//         title: "Gather project requirements",
//         description:
//           "Meet with stakeholders to understand project goals and requirements.",
//         status: "COMPLETED",
//         projectId: project.id,
//         assigneeId: 1, // ID del usuario administrador
//       },
//       {
//         title: "Create wireframes",
//         description: "Design the initial wireframes for the website layout.",
//         status: "IN_PROGRESS",
//         projectId: project.id,
//         assigneeId: 2, // ID del usuario regular
//       },
//       {
//         title: "Implement homepage design",
//         description:
//           "Develop and implement the homepage design based on approved wireframes.",
//         status: "PENDING",
//         projectId: project.id,
//         assigneeId: 2,
//       },
//       {
//         title: "Conduct usability testing",
//         description:
//           "Test the website design with users to gather feedback and identify improvements.",
//         status: "PENDING",
//         projectId: project.id,
//         assigneeId: 2,
//       },
//     ],
//   });
// }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
