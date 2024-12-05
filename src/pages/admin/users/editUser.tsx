"use client";

import AdminLayout from "@/layouts/_layout";
import { UserEditForm } from "@/molecules/userEditForm";

import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_USER_QUERY } from "@/utils/graphql/queries/users";
import useMiddleware from "@/hooks/useMiddleware";
import { IsLoading } from "@/molecules/isLoading";
import { Role } from "@/utils/enums";

const EditUserPage: React.FC = () => {
  const user = useMiddleware(Role.ADMIN);

  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_USER_QUERY, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <IsLoading />;
  if (error) return <p>Error: {error.message}</p>;

  const userData = data?.user;

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className={"w-4/5 mx-auto"}>
        <h1 className="scroll-m-20 text-xl text-black font-semibold lg:text-xl text-left  my-10 ">
          Usuarios / Editar usuario
        </h1>

        {userData && <UserEditForm user={userData} />}
      </div>
    </AdminLayout>
  );
};

export default EditUserPage;
