// src/components/appointments/AddEventDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";

import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";
//import AsyncSelectForFullCalendar from "@/components/patient/patientSearch/AsyncSelectForFullCalendar";
//import AsyncSelectForFullCalendar from "@/components/patient/patientSearch/AsyncSelectModalDialog.jsx";
import AsyncSelectModalDialog from "@/features/patient/components/patientSearch/AsyncSelectModalDialog";

import * as appointmentService from "@/services/configService";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { validateAppointment } from "@/utils/validators";
import { useReusableFormAppointment } from "@/components/shared/ui/useReusableFormAppointment";
import { ReusableForm } from "@/components/shared/ui/useReusableForm";

// Hide button text on small screens
const Span = styled("span", {
  shouldForwardProp: (prop) => prop !== "show",
})(({ show }) => ({
  ...(show && { display: "none" }),
}));

// --- Default values (start next full hour + 20 min later) ---
const now = new Date();
const nextHour = new Date(now);
nextHour.setHours(now.getHours() + 1, 0, 0, 0);

const twentyMinutesLater = new Date(nextHour);
twentyMinutesLater.setMinutes(nextHour.getMinutes() + 20);

const initialValues = {
  id: "",
  fullName: "",
  notRegistered: "",
  patientId: "",
  type: "CONSULTA",
  status: "PROGRAMADA",
  start: nextHour.toISOString(),
  end: twentyMinutesLater.toISOString(),
  description: "",
};

export default function AddEventDialog({ show, closeDialog, addEvent }) {
  const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const applicationFields = queryClient.getQueryData(["applicationFields"]);

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    validate,
  } = useReusableFormAppointment(initialValues, true, validateAppointment);

  const { toDate } = useAppointmentForm();

  const [errorMsg, setErrorMsg] = useState("");

  // --- Patient selection (registered) ---
  const onAutoCompleteChange = (val) => {
    setValues({
      ...values,
      fullName: val?.fullName || "",
      patientId: val?.id || "",
      notRegistered: "", // clear manual entry
    });
    setErrors({ ...errors, fullName: "", notRegistered: "" });
  };

  const handleIconFullName = () =>
    setValues({ ...values, fullName: "", patientId: "" });

  // --- Unregistered patient manual entry ---
  const handleNotRegisteredChange = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      notRegistered: value,
      fullName: "",   // clear registered info
      patientId: "",  // clear registered info
    });
    handleInputChange(e);
  };

  const handleIconNotRegistered = () =>
    setValues({ ...values, notRegistered: "" });

  // --- Dialog actions ---
  const handleDialogClose = () => {
    resetForm();
    closeDialog();
  };

  const handleDialogSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addEvent(values);
      resetForm();
      closeDialog();
    } catch (err) {
      console.error("Error saving appointment:", err);
      setErrorMsg(err.message || "Error al guardar la cita");
    }
  };

  return (
    <>
      <Dialog
        fullScreen={matches}
        open={show}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") handleDialogClose(event, reason);
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between">
            <span>Añadir Nueva Cita</span>
            <IconButton aria-label="close" onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>

        <DialogContent>
          <ReusableForm>
            {/* Registered patient search */}
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

            {/* Unregistered patient manual entry */}
            <ReusableControls.CustomInputIconEdit
              variant="outlined"
              name="notRegistered"
              label="Paciente NO Registrado"
              value={values.notRegistered}
              onChange={handleNotRegisteredChange}
              error={errors.notRegistered}
              handleIconClick={handleIconNotRegistered}
            />

            {/* Appointment type */}
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

            {/* Appointment status */}
            <ReusableControls.CustomSelect
              variant="outlined"
              name="status"
              label="Estado de Cita"
              value={values.status}
              onChange={handleInputChange}
              options={appointmentService.getFieldsDataCollection(
                applicationFields,
                "appointmentView",
                "appointmentStatus"
              )}
            />

            {/* --- Start DateTime with automatic end adjustment --- */}
            <ReusableControls.PlainDateTimePicker
              name="start"
              label="Inicio de Cita"
              value={toDate(values.start)}
              onChange={(newStart) => {
                const startISO =
                  newStart instanceof Date
                    ? newStart.toISOString()
                    : newStart.target?.value || "";

                const newEnd = new Date(startISO);
                newEnd.setMinutes(newEnd.getMinutes() + 20);
                const endISO = newEnd.toISOString();

                setValues({
                  ...values,
                  start: startISO,
                  end: endISO,
                });

                handleInputChange({ target: { name: "start", value: startISO } });
                handleInputChange({ target: { name: "end", value: endISO } });
              }}
              error={errors.start}
            />
            <ReusableControls.PlainDateTimePicker
              name="end"
              label="Fin de Cita"
              value={toDate(values.end)}
              onChange={(newEnd) => {
                const endISO =
                  newEnd instanceof Date
                    ? newEnd.toISOString()
                    : newEnd.target?.value || "";
                setValues({ ...values, end: endISO });
                handleInputChange({ target: { name: "end", value: endISO } });
              }}
              error={errors.end}
            />

            {/* Description */}
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
          <Grid container justifyContent="space-between">
            <Button
              onClick={handleDialogSave}
              color="primary"
              startIcon={<SaveIcon />}
            >
              <Span show={matches}>Guardar</Span>
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(errorMsg)}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
      >
        <Alert severity="error" onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
