import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { DELETE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { useRouter } from "next/router";
import { UserProps } from "@/utils/enums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/ui/icons";
import * as React from "react";

interface UsersTableProps {
  users: UserProps[];
  refetch: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, refetch }) => {
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteUser({ variables: { id } });
    refetch();
    setDeletingId(null);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/users/editUser?id=${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className="flex space-x-5 justify-end">
              <Button
                variant="secondary"
                onClick={() => handleEdit(user.id)}
                className="flex items-center justify-center p-2 border border-blue-500 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">
                Editar{" "}
              </Button>
              <Button
                onClick={() => handleDelete(user.id)}
                disabled={deletingId === user.id}
                variant="destructive"
                className="flex items-center justify-end p-2 border border-red-500  bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition">
                {deletingId === user.id ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>Eliminar</>
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
