"use client";

import AdminLayout from "@/layouts/_layout";

import { IsLoading } from "@/molecules/isLoading";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";
import ProjectCreationForm from "@/molecules/projectCreationForm";

const CreateItemPage: React.FC = () => {
  const user = useMiddleware(Role.ADMIN);

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className={"w-4/5 mx-auto"}>
        <h1 className="scroll-m-20 text-xl text-black font-semibold lg:text-xl text-left  my-10 ">
          Proyectos / Crear Proyecto
        </h1>
        <ProjectCreationForm />
      </div>
    </AdminLayout>
  );
};

export default CreateItemPage;
