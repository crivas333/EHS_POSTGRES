// src/utils/validators.js

export function validateAppointment(values) {
  const errors = {};

  // --- Full name or notRegistered must be provided ---
  if (!values.fullName && !values.notRegistered) {
    errors.fullName = "Debe seleccionar un paciente";
    errors.notRegistered = "Debe ingresar un nombre si no está registrado";
  } else {
    errors.fullName = "";
    errors.notRegistered = "";
  }

  // --- Appointment type required ---
  errors.type = values.type ? "" : "Debe seleccionar un tipo de cita";

  // --- Dates ---
  if (!values.start) {
    errors.start = "Debe seleccionar fecha de inicio";
  } else {
    errors.start = "";
  }

  if (!values.end) {
    errors.end = "Debe seleccionar fecha de fin";
  } else if (
    values.start &&
    values.end &&
    new Date(values.end) <= new Date(values.start)
  ) {
    errors.end = "La fecha de fin debe ser posterior al inicio";
  } else {
    errors.end = "";
  }

  // --- Description (optional) ---
  if (values.description && values.description.length > 250) {
    errors.description = "La descripción no puede superar 250 caracteres";
  } else {
    errors.description = "";
  }

  // --- Is form valid? ---
  const isValid = Object.values(errors).every((x) => x === "");

  return { errors, isValid };
}
