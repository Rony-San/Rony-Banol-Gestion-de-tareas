"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Undo2 } from "lucide-react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { UserProps } from "@/utils/enums";
import { Icons } from "@/components/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";
import { useRouter } from "next/router";

interface UserEditFormProps {
  user: UserProps;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user }) => {

  const router = useRouter();
  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const { data, errors } = await updateUser({
      variables: {
        id: user.id,
        name,
        email,
        password,
        role,
      },
      refetchQueries: [{ query: GET_ALL_USERS_QUERY }],
    });

    if (data) {
      setOpenInfo(true);
      form.reset();
    }

    if (errors) {
      setOpenInfo(true);
      setOpenError(true);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <div className="relative flex items-center mb-6">
        {/* Botón a la izquierda */}
        <Button
          type="button"
          onClick={handleBack}
          className="absolute left-0 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-md">
          <Undo2 /> Regresar
        </Button>

        {/* Título perfectamente centrado */}
        <h1 className="w-full text-3xl font-bold text-center text-gray-800">
          Editar Usuario
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <Input
            type="text"
            placeholder="Nombre"
            defaultValue={user.name}
            name="name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <Input
            type="email"
            placeholder="Email"
            defaultValue={user.email}
            name="email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Contraseña */}
        <div>
          <Input
            type="password"
            placeholder="Contraseña"
            name="password"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Rol */}
        <div>
          <Select name="role" required>
            <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
              <SelectValue
                placeholder="Selecciona un Rol"
                defaultValue={user.role}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botón Actualizar */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className={`py-3 px-6 rounded-lg font-semibold text-white shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600"
            }`}>
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Check /> Actualizar
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Snackbar de Información */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openInfo}
        autoHideDuration={3000}
        onClose={() => setOpenInfo(false)}
        key={"bottomright"}>
        {openError ? (
          <Alert severity="error" variant="filled">
            Hubo un error al actualizar el usuario
          </Alert>
        ) : (
          <Alert severity="success" variant="filled">
            Usuario actualizado exitosamente
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};
