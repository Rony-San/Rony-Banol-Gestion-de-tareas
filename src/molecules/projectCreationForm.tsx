import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "@/utils/graphql/mutations/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, Snackbar } from "@mui/material";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/router";

const CreateProjectPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openInfo, setOpenInfo] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [createProject, { loading }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, errors } = await createProject({
      variables: {
        name,
        description,
      },
      refetchQueries: [
        {
          query: GET_PROJECTS,
        },
      ],
    });

    if (data) {
      setOpenInfo(true);
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
      {/* Encabezado */}
      <div className="relative flex items-center mb-6">
        <Button
          type="button"
          onClick={handleBack}
          className="absolute left-0 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-md">
          <Undo2 /> Regresar
        </Button>
        <h1 className="w-full text-3xl font-bold text-center text-gray-800">
          Crear Proyecto
        </h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre del Proyecto */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-800">
            Nombre del Proyecto
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Introduce el nombre del proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Descripción */}
        <div>
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-800">
            Descripción
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Introduce una breve descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Botón Crear */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className={`py-3 px-6 rounded-lg font-semibold text-white shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600"
            }`}>
            {loading ? "Creando proyecto..." : "Crear proyecto"}
          </Button>
        </div>
      </form>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openInfo}
        autoHideDuration={3000}
        onClose={() => setOpenInfo(false)}
        key={"bottomright"}>
        {openError ? (
          <Alert severity="error" variant="filled">
            Error al crear el proyecto
          </Alert>
        ) : (
          <Alert severity="success" variant="filled">
            Proyecto creado exitosamente
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default CreateProjectPage;
