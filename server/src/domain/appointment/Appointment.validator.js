// src/domain/appointment/Appointment.validator.js
import { ValidationError } from "../shared/index.js";

export const AppointmentValidator = {
  create(input) {
    if (!input.type?.trim()) throw new ValidationError("Appointment type is required");
    if (!input.status?.trim()) throw new ValidationError("Status is required");

    const validStatuses = [
      "PROGRAMADA", "CONFIRMADA", "PACIENTE LLEGÓ",
      "EN ATENCIÓN", "FINALIZADA", "CANCELADA", "REPROGRAMADA"
    ];
    if (!validStatuses.includes(input.status.trim().toUpperCase())) {
      throw new ValidationError(`Invalid status: ${input.status}`);
    }

    const start = new Date(input.start);
    const end = new Date(input.end);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ValidationError("Invalid start or end date");
    }
    if (end <= start) {
      throw new ValidationError("End time must be after start time");
    }
  },
};