"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, Snackbar } from "@mui/material";
import { useMutation } from "@apollo/client";
import { CREATE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";
import { Icons } from "@/components/ui/icons";
import { Plus, Undo2 } from "lucide-react";
import { useState } from "react";

export const UserCreationForm: React.FC = () => {
  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);
  const [openInfo, setOpenInfo] = useState(false);
  const [openError, setOpenError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const { data, errors } = await createUser({
      variables: {
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

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Crear nuevo Usuario
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 flex flex-col items-center">
        {/* Nombre */}
        <div className="w-full">
          <Label htmlFor="name" className="text-sm font-medium text-gray-800">
            Nombre
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Ingrese el nombre"
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="w-full">
          <Label htmlFor="email" className="text-sm font-medium text-gray-800">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Ingrese el email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Contraseña */}
        <div className="w-full">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-800">
            Contraseña
          </Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Ingrese la contraseña"
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Rol */}
        <div className="w-full">
          <Label htmlFor="role" className="text-sm font-medium text-gray-800">
            Rol
          </Label>
          <Select name="role" required>
            <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
              <SelectValue placeholder="Selecciona un Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botones */}
        <div className="flex justify-between w-full mt-4">
          <Button
            type="button"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-md"
            onClick={() => window.history.back()}>
            <Undo2 /> Regresar
          </Button>

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
                Creando...
              </>
            ) : (
              <>
                <Plus /> Crear
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
            Error al crear el usuario
          </Alert>
        ) : (
          <Alert severity="success" variant="filled">
            Usuario creado exitosamente
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};
