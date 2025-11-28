// src/domain/appointment/Appointment.factory.js
import { Appointment } from "./Appointment.entity.js";
import { ValidationError } from "../shared/index.js";

const parseDate = (input) => {
  if (!input) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    throw new ValidationError(`Invalid date: ${input}`);
  }
  return d;
};

export const AppointmentFactory = {
  create(input) {
    if (!input.start || !input.end || !input.type || !input.status) {
      throw new ValidationError("start, end, type, and status are required");
    }

    return new Appointment({
      ...input,
      start: parseDate(input.start),
      end: parseDate(input.end),
      arriveTime: input.arriveTime ? parseDate(input.arriveTime) : null,
      type: input.type.trim(),
      status: input.status.trim().toUpperCase(),
      patientId: input.patientId ? Number(input.patientId) : null,
      creatorId: input.creatorId ? Number(input.creatorId) : null,
    });
  },

  fromSequelize(model) {
    if (!model) return null;
    const data = model.get({ plain: true });
    data.patient = model.patient ? model.patient.get({ plain: true }) : null;
    data.creator = model.creator ? model.creator.get({ plain: true }) : null;
    return new Appointment(data);
  },
};