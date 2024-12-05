import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IsLoading } from "@/molecules/isLoading";
import { Role } from "@/utils/enums";
import { ProjectData } from "@/molecules/projectData";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const user = useMiddleware(Role.USER);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      setIsAdmin(true);
    }
  }, [user]);

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className="w-4/5 mx-auto">
        <h1 className="scroll-m-20 text-xl text-black font-semibold lg:text-xl text-left  my-10 ">
          Proyectos
        </h1>
        <ProjectData />
        <Button
          className={`${isAdmin ? "mt-10" : "hidden"} bg-amber-500`}
          asChild>
          <Link href={"/admin/projects/createProject"}>+ Nuevo Proyecto</Link>
        </Button>
      </div>
    </AdminLayout>
  );
}
