"use client";

import AdminLayout from "@/layouts/_layout";
import { UserCreationForm } from "@/molecules/userCreationForm";

import { IsLoading } from "@/molecules/isLoading";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";

const CreateUserPage: React.FC = () => {
  const user = useMiddleware(Role.ADMIN);

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className={"w-4/5 mx-auto"}>
        <h1 className="scroll-m-20 text-xl text-black font-semibold lg:text-xl text-left  my-10 ">
          Usuarios / Crear usuario
        </h1>

        <UserCreationForm />
      </div>
    </AdminLayout>
  );
};

export default CreateUserPage;
