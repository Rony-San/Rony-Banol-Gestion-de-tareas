import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "@/utils/graphql/mutations/project";
import { Project } from "@/types/projects";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { toast } from "react-toastify";

interface EditProjectPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  project: Project;
}

const EditProjectPopup: React.FC<EditProjectPopupProps> = ({
  open,
  setOpen,
  project,
}) => {
  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
  });

  const [updateProject, { loading }] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [{
      query: GET_PROJECTS
    }],
    awaitRefetchQueries: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { data, errors } = await updateProject({
      variables: {
        id: project.id,
        name: formData.name,
        description: formData.description,
      },
    });

    if (data) {
      toast.success("Proyecto actualizado correctamente");
    }
    if (errors) {
      toast.error("Ha ocurrido un error al actualizar el proyecto");
    }

    setOpen(false);

  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Editar Proyecto</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectPopup;
