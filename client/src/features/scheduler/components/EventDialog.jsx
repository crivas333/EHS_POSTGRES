import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls.js";
import {
  useReusableForm,
  ReusableForm,
} from "@/components/shared/ui/useReusableForm.jsx";
import * as appointmentService from "@/services/configService";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AsyncSelectModalDialog from "@/features/patient/components/patientSearch/AsyncSelectModalDialog";

// 🔹 Normalize evt so start/end are always Date objects
const normalizeEvent = (evt) => ({
  ...evt,
  start: evt?.start ? new Date(evt.start) : new Date(),
  end: evt?.end ? new Date(evt.end) : new Date(),
});

const Span = styled("span", {
  shouldForwardProp: (prop) => prop !== "show",
})(({ show }) => ({
  ...(show && { display: "none" }),
}));

export default function EventDialog(props) {
  const {
    evt,
    closeDialog,
    handleAddingEvt,
    handleChangingEvt,
    handleRemovingEvt,
    isEditing,
  } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const queryClient = useQueryClient();
  const applicationFields = queryClient.getQueryData(["applicationFields"]);

  // ✅ validate only checks, doesn’t mutate values anymore
  const validate = (fieldValues = values) => {
    const temp = { ...errors };

    if ("fullName" in fieldValues || "notRegistered" in fieldValues) {
      if (!fieldValues.fullName && !fieldValues.notRegistered) {
        temp.fullName = "Seleccione o escriba un paciente";
      } else {
        temp.fullName = "";
        temp.notRegistered = "";
      }
    }

    setErrors({ ...temp });
    if (fieldValues === values) {
      return Object.values(temp).every((x) => x === "");
    }
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useReusableForm(normalizeEvent(evt), true, validate);

  useEffect(() => {
    setValues(normalizeEvent(evt));
  }, [evt, setValues]);

  // 🔹 Autocomplete registered patient
  const onAutoCompleteChange = (val) => {
    setValues((prev) => ({
      ...prev,
      fullName: val?.fullName || "",
      patientId: val?.id || "",
      notRegistered: "", // clear other field
    }));
    setErrors((prev) => ({ ...prev, notRegistered: "", fullName: "" }));
  };

  // 🔹 Manual input for not registered patient
  const handleNotRegisteredChange = (e) => {
    const value = e.target.value;
    setValues((prev) => ({
      ...prev,
      notRegistered: value,
      fullName: "",   // clear other field
      patientId: "",  // reset patientId
    }));
    setErrors((prev) => ({ ...prev, notRegistered: "", fullName: "" }));
  };

  const handleIconFullName = () =>
    setValues((prev) => ({ ...prev, fullName: "", patientId: "" }));
  const handleIconNotRegistered = () =>
    setValues((prev) => ({ ...prev, notRegistered: "" }));

  const handleDialogClose = () => {
    resetForm();
    closeDialog();
  };

  const handleDialogAdd = (e) => {
    e.preventDefault();
    //console.log("FC_EventDialog-handleDialogAdd: ",values);
    if (validate()) {
      const payload = {
        ...values,
        start: values.start.toISOString(),
        end: values.end.toISOString(),
      };
      handleAddingEvt(payload);
      resetForm();
      closeDialog();
    }
  };

  const handleDialogChange = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        ...values,
        start: values.start.toISOString(),
        end: values.end.toISOString(),
      };
      handleChangingEvt(payload);
      resetForm();
      closeDialog();
    }
  };

  const handleDialogDelete = () => setOpenConfirmation(true);
  const handleConfirmationCancel = () => setOpenConfirmation(false);
  const handleConfirmationOk = (e) => {
    e.preventDefault();
    handleRemovingEvt(values);
    resetForm();
    setOpenConfirmation(false);
    closeDialog();   // ✅ closes the EditDialog too
  };

  return (
    <>
      <Dialog
        fullScreen={matches}
        open={props.show}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") handleDialogClose(event, reason);
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between">
            <span>{isEditing ? "Actualizar Cita" : "Añadir Cita"}</span>
            <IconButton aria-label="close" onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>

        <DialogContent>
          <ReusableForm>
            {/* --- Patient Info --- */}
            <ReusableControls.CustomInput
              variant="outlined"
              name="id"
              label="ID"
              value={values.id}
              error={errors.id}
            />

            <AsyncSelectModalDialog onValChange={onAutoCompleteChange} />

            <ReusableControls.CustomInputIconDelete
              variant="outlined"
              name="fullName"
              label="Paciente Registrado"
              value={values.fullName}
              error={errors.fullName}
              handleIconClick={handleIconFullName}
              readOnly
            />

            <ReusableControls.CustomInputIconEdit
              variant="outlined"
              name="notRegistered"
              label="Paciente NO Registrado"
              value={values.notRegistered}
              onChange={handleNotRegisteredChange}   // ✅ exclusivity enforced
              error={errors.notRegistered}
              handleIconClick={handleIconNotRegistered}
            />

            <ReusableControls.CustomSelect
              variant="outlined"
              name="type"
              label="Tipo de Cita"
              value={values.type}
              onChange={handleInputChange}
              options={appointmentService.getFieldsDataCollection(
                applicationFields,
                "appointmentView",
                "appointmentType"
              )}
              error={errors.type}
            />

            <ReusableControls.CustomSelect
              variant="outlined"
              name="status"
              label="Estado de la Cita"
              value={values.status}
              onChange={handleInputChange}
              options={appointmentService.getFieldsDataCollection(
                applicationFields,
                "appointmentView",
                "appointmentStatus"
              )}
            />

            {/* --- Start DateTime --- */}
            <ReusableControls.PlainDateTimePicker
              inputVariant="outlined"
              //disablePast
              name="start"
              label="Inicio de Cita"
              value={values.start}
              onChange={(newStart) => {
                let startDate = null;
                if (newStart?.target?.value) {
                  const parsed = new Date(newStart.target.value);
                  if (!isNaN(parsed.getTime())) startDate = parsed;
                } else if (typeof newStart?.toDate === "function") {
                  startDate = newStart.toDate();
                } else if (newStart instanceof Date) {
                  startDate = newStart;
                }

                if (!startDate || isNaN(startDate.getTime())) {
                  console.error("Invalid start date:", newStart);
                  return;
                }

                const newEnd = new Date(startDate.getTime() + 20 * 60000); // shift by 20 min
                setValues({ ...values, start: startDate, end: newEnd });
              }}
              error={errors.start}
            />

            {/* --- End DateTime --- */}
            <ReusableControls.PlainDateTimePicker
              inputVariant="outlined"
              //disablePast
              name="end"
              label="Fin de Cita"
              value={values.end}
              onChange={(newEnd) => {
                let endDate = null;
                if (newEnd?.target?.value) {
                  const parsed = new Date(newEnd.target.value);
                  if (!isNaN(parsed.getTime())) endDate = parsed;
                } else if (typeof newEnd?.toDate === "function") {
                  endDate = newEnd.toDate();
                } else if (newEnd instanceof Date) {
                  endDate = newEnd;
                }

                if (!endDate || isNaN(endDate.getTime())) {
                  console.error("Invalid end date:", newEnd);
                  return;
                }

                setValues({ ...values, end: endDate });
              }}
              error={errors.end}
            />

            {/* --- Description --- */}
            <ReusableControls.CustomInputMulti
              variant="outlined"
              name="description"
              label="Descripción"
              maxLines={2}
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
            />
          </ReusableForm>
        </DialogContent>

        <DialogActions>
          {isEditing ? (
            <Grid container justifyContent="space-between">
              <Button
                onClick={handleDialogDelete}
                color="secondary"
                startIcon={<DeleteIcon />}
              >
                <Span show={matches}>Eliminar</Span>
              </Button>
              <Button
                onClick={handleDialogChange}
                color="primary"
                startIcon={<SaveIcon />}
              >
                <Span show={matches}>Guardar</Span>
              </Button>
            </Grid>
          ) : (
            <Button
              onClick={handleDialogAdd}
              color="primary"
              startIcon={<SaveIcon />}
            >
              <Span show={matches}>Guardar</Span>
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* --- Delete Confirmation --- */}
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
              autoFocus
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
