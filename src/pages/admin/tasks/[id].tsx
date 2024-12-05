import { useRouter } from "next/router";
import React from "react";
import TaskCard from "@/molecules/taskData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";
import { IsLoading } from "@/molecules/isLoading";
import { LoadingSkeleton } from "@/molecules/loadinSkeleton";

const TasksProject = () => {
  const router = useRouter();
  const { id } = router.query; // Extrae el parámetro `id` de la URL

  const user = useMiddleware(Role.USER);

  if (!user) {
    return <IsLoading />;
  }

  if (!id) {
    return <LoadingSkeleton />;
  }

  return (
    <AdminLayout user={user}>
      <div className="w-4/5 mx-auto">
        <h1 className="scroll-m-20 text-xl text-black font-semibold lg:text-xl text-left  my-10 ">
          Proyectos / Tareas
        </h1>
        <TaskCard id={id as string} />
        <Button
          className={`${
            user.role === "ADMIN" ? "my-10" : "hidden"
          } bg-amber-500`}
          asChild>
          <Link
            href={{ pathname: "/admin/tasks/create/[id]", query: { id: id } }}>
            Nueva tarea
          </Link>
        </Button>
      </div>
    </AdminLayout>
  );
};

export default TasksProject;
