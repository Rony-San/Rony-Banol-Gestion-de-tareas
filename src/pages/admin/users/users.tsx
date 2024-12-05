import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { UsersTable } from "@/molecules/usersTable";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";
import { IsLoading } from "@/molecules/isLoading";
import { Role } from "@/utils/enums";

export default function AdminUsersPage() {
  const user = useMiddleware(Role.ADMIN);

  const { data, refetch } = useQuery(GET_ALL_USERS_QUERY);
  const router = useRouter();
  const { reload } = router.query;

  useEffect(() => {
    if (reload) {
      refetch();
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [reload, router, refetch]);

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className={"w-4/5 mx-auto"}>
        <h1 className="scroll-m-20 text-xl mt-10 text-black font-semibold lg:text-xl text-left mb-10">
          Usuarios
        </h1>
        <UsersTable users={data ? data.users : []} refetch={refetch} />
        <Button className={"mt-10 bg-amber-500 hover:bg-amber-600"} asChild>
          <Link href={"/admin/users/createUser"}>
            <Plus />
            Nuevo Usuario
          </Link>
        </Button>
      </div>
    </AdminLayout>
  );
}
