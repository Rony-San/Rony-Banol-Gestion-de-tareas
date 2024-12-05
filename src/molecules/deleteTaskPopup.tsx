import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { DELETE_TASK } from "@/utils/graphql/mutations/tasks";
import { useMutation } from "@apollo/client";
import { Task } from "@/types/tasks";
import { useRouter } from 'next/router';
import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { toast } from "react-toastify";

interface DeleteTaskPopupProps {
  open: boolean;
  task: Task;
  setOpen: (open: boolean) => void;
}

const DeleteTaskPopup: React.FC<DeleteTaskPopupProps> = ({ open, task, setOpen }) => {

  const router = useRouter();
  const { id } = router.query;
  const [deleteTask, { loading }] = useMutation(DELETE_TASK, {
    variables: { id: task.id },
    refetchQueries: [{
      query: GET_TASKS_BY_PROJECT,
      variables: { projectId: id },
    }],
    awaitRefetchQueries: true,
  });


  const handleDelete = async () => {
    const {data, errors} = await deleteTask();
    if(data){
      toast.success("Tarea eliminada correctamente");
    }
    if(errors){
      toast.error("Ha ocurrido un error al eliminar la tarea");
    }

    setOpen(false);


  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth disableEnforceFocus>
      <DialogTitle>Eliminar Tarea</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar la tarea <strong>{task.title}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} disabled={loading} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleDelete} disabled={loading} color="error" variant="contained">
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskPopup;
