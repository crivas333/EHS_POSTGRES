// src/components/appointments/EditEventDialog.jsx
import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import ReusableControls from "@/components/shared/ui/reusableControls/ReusableControls";
//import AsyncSelectForFullCalendar from "@/components/patient/patientSearch/AsyncSelectForFullCalendar";
//import AsyncSelectForFullCalendar from "@/components/patient/patientSearch/AsyncSelectModalDialog.jsx";
import AsyncSelectModalDialog from "@/features/patient/components/patientSearch/AsyncSelectModalDialog";


import * as appointmentService from "@/services/configService";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { validateAppointment } from "@/utils/validators";
import { useReusableFormAppointment } from "@/components/shared/ui/useReusableFormAppointment";
import { ReusableForm } from "@/components/shared/ui/useReusableForm";

// Styled component for hiding text on small screens
const Span = styled("span", {
  shouldForwardProp: (prop) => prop !== "show",
})(({ show }) => ({
  ...(show && { display: "none" }),
}));

export default function EditEventDialog({
  show,
  evt,
  closeDialog,
  handleChangingEvt,
}) {
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
  } = useReusableFormAppointment(evt, true, validateAppointment);

  const { toDate } = useAppointmentForm({ values, setErrors, errors });

  // Keep form in sync with evt prop
  useEffect(() => {
    setValues(evt);
  }, [evt, setValues]);

  // ----------------------------
  // Exclusive Patient Handlers
  // ----------------------------
  const selectRegisteredPatient = (patient) => {
    setValues({
      ...values,
      fullName: patient?.fullName || "",
      patientId: patient?.id || "",
      notRegistered: "", // clear manual entry
    
    });
    setErrors({ ...errors, fullName: "", notRegistered: "" });
  };

  const clearRegisteredPatient = () => {
    setValues({
      ...values,
      fullName: "",
      patientId: "",
      
    });
  };

  const clearNotRegisteredPatient = () => {
    setValues({
      ...values,
      notRegistered: "",
      // registered info untouched
    });
  };

  const handleNotRegisteredChange = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      notRegistered: value,
      fullName: "",  // clear registered patient
      patientId: "", // clear patient reference
      
    });
    handleInputChange(e);
  };

  // ----------------------------
  // Dialog Actions
  // ----------------------------
  const handleDialogClose = () => {
    resetForm();
    closeDialog();
  };

  const handleDialogSave = (e) => {
    e.preventDefault();
    if (validate()) {
      handleChangingEvt(values);
      resetForm();
      closeDialog();
    }
  };

  return (
    <Dialog
      fullScreen={matches}
      open={show}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") handleDialogClose(event, reason);
      }}
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <span>Actualizar Cita</span>
          <IconButton aria-label="close" onClick={handleDialogClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>

      <DialogContent>
        <ReusableForm>
          {/* ID - read-only */}
          <ReusableControls.CustomDisplay
            variant="outlined"
            name="id"
            label="ID"
            value={values.id}
            error={errors.id}
          />

          {/* Registered patient search */}
          <AsyncSelectModalDialog onValChange={selectRegisteredPatient} />

          <ReusableControls.CustomInputIconDelete
            variant="outlined"
            name="fullName"
            label="Paciente Registrado"
            value={values.fullName}
            error={errors.fullName}
            handleIconClick={clearRegisteredPatient}
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
            handleIconClick={clearNotRegisteredPatient}
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

          {/* Start datetime w/ auto end adjustment */}
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

          {/* End datetime */}
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
  );
}
