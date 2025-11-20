import React, { useEffect } from "react";
import {
  useReusableForm,
  ReusableForm,
} from "@/components/shared/ui/useReusableForm";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const Span = styled("span", {
  shouldForwardProp: (prop) => prop !== "show",
})(({ show }) => ({
  ...(show && { display: "none" }),
}));

export default function DeleteEventDialog({
  show,
  evt,
  closeDialog,
  handleRemovingEvt,
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [openConfirmation, setOpenConfirmation] = React.useState(false);

  const { values, setValues, resetForm } = useReusableForm(evt, true);

  useEffect(() => {
    setValues(evt);
  }, [evt, setValues]);

  const handleDialogClose = () => {
    resetForm();
    closeDialog();
  };

  const handleDialogDelete = () => setOpenConfirmation(true);

  const handleConfirmationCancel = () => setOpenConfirmation(false);

  const handleConfirmationOk = () => {
    handleRemovingEvt(values);
    resetForm();
    setOpenConfirmation(false);
    closeDialog();
  };

  return (
    <>
      <Dialog fullScreen={matches} open={show} onClose={handleDialogClose}>
        <DialogTitle>
          <Grid container justifyContent="space-between">
            <span>Eliminar Cita</span>
            <IconButton aria-label="close" onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>

        <DialogActions>
          <Grid container justifyContent="space-between">
            <Button
              onClick={handleDialogDelete}
              color="secondary"
              startIcon={<DeleteIcon />}
            >
              <Span show={matches}>Eliminar</Span>
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmation} disableEscapeKeyDown onClose={() => {}}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>¿Seguro que desea ELIMINAR esta CITA?</DialogContent>
        <DialogActions>
          <Grid container justifyContent="space-between">
            <Button
              onClick={handleConfirmationOk}
              color="secondary"
              startIcon={<DeleteIcon />}
            >
              <Span show={matches}>Eliminar</Span>
            </Button>
            <Button
              onClick={handleConfirmationCancel}
              color="primary"
              startIcon={<CloseIcon />}
            >
              <Span show={matches}>Cancelar</Span>
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}
