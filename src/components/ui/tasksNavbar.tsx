import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "@/utils/graphql/mutations/auth";
import { Icons } from "./icons";

interface AdminNavbarProps {
  user: {
    name: string;
    avatarUrl?: string;
  };
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logout] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      localStorage.removeItem("token");
      router.reload(); // Recarga la página tras el logout
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white bg-opacity-30 shadow-sm p-4 flex justify-between items-center">
      {/* Left Section: Title or Logo */}
      <h1 className="text-xl font-bold text-gray-800"></h1>

      {/* Right Section: User Info */}
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={
              user.avatarUrl ||
              "https://ih1.redbubble.net/image.424871785.5179/st,small,845x845-pad,1000x1000,f8f8f8.u3.jpg"
            }
            alt={user.name || "User"}
          />
          <AvatarFallback>
            {user.name
              ?.split(" ")
              .map((part) => part[0])
              .join("") || "US"}
          </AvatarFallback>
        </Avatar>
        <p className="text-gray-800 mr-8">{user.name || "Usuario"}</p>
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-red-400 hover:bg-red-600">
          {isLoading && <Icons.spinner className="mx-8 h-4 w-4 animate-spin" />}
          Desconectar
        </Button>
      </div>
    </nav>
  );
};
