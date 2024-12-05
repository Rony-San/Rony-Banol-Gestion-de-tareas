import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DELETE_PROJECT } from "@/utils/graphql/mutations/project";
import { Project } from "@/types/projects";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";

interface DeleteProjectPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  project: Project;
}

const DeleteProjectPopup: React.FC<DeleteProjectPopupProps> = ({
  open,
  setOpen,
  project,
}) => {
  const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
    variables: { id: project.id },
    refetchQueries: [{ query: GET_PROJECTS }],
    awaitRefetchQueries: true,
  });

  const handleDelete = async () => {
    const { data, errors } = await deleteProject({
      variables: {
        id: project.id,
      },
    });

    if (data) {
      toast.success("Proyecto eliminado exitosamente.");
    }
    if (errors) {
      toast.error("Error al eliminar el proyecto.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Eliminar Proyecto</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres eliminar el proyecto{" "}
          <strong>{project.name}</strong>? Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary" disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteProjectPopup;
