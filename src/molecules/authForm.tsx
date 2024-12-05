"use client";

import * as React from "react";
import { useMutation } from "@apollo/client";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LOGIN_MUTATION } from "@/utils/graphql/mutations/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { ApolloError } from "@apollo/client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [login] = useMutation(LOGIN_MUTATION);
  const [showPopup, setShowPopup] = React.useState<boolean>(false); // Controla el popup
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data } = await login({
        variables: { email, password },
      });

      if (data && data.login) {
        localStorage.setItem("token", data.login.token);
        await router.push("/admin");
      }
    } catch (error) {
      if (error instanceof ApolloError) {
        // Verificamos si es un error de Apollo
        if (
          error.graphQLErrors.length > 0 &&
          error.graphQLErrors[0].message === "No such user found"
        ) {
          setShowPopup(true); // Mostrar popup si el usuario no está en la base de datos
        } else {
          toast.error("Usuario o contraseña incorrectos");
        }
        
      } else {
        console.error("Unexpected error:", error);
        toast.error("Ocurrió un error inesperado");
      }
    }

    setIsLoading(false);
  }
  return (
    <>
      <div className={cn("grid gap-6", className)} {...props}>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenido</h1>
          <p className="text-sm text-muted-foreground text-white">
            Ingresa sus datos
          </p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="password">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                placeholder="contraseña"
                type="password"
                disabled={isLoading}
              />
            </div>
            <Button
              disabled={isLoading}
              className="bg-blue-700 justify-center w-2/5">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin " />
              )}
              Conectar
            </Button>
          </div>
        </form>
      </div>

      {/* Popup para usuario no encontrado */}
      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>Usuario no encontrado</DialogTitle>
        <DialogContent>
          <p>
            No pudimos encontrar una cuenta asociada a este correo. Por favor,
            verifica tus credenciales o contacta al administrador.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowPopup(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
