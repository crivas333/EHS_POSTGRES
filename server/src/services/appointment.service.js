// src/services/appointment.service.js
import { Appointment, Patient, User } from "../models/index.js";
import { Op } from "sequelize";
import {
  AppointmentFactory,
  AppointmentValidator,
} from "../domain/appointment/index.js";
import { NotFoundError } from "../domain/shared/index.js";

class AppointmentService {
  async getByTimeframe(start, end) {
    const appointments = await Appointment.findAll({
      where: {
        start: { [Op.gte]: new Date(start) },
        end: { [Op.lte]: new Date(end) },
      },
      include: [
        { model: Patient, as: "patient" },
        { model: User, as: "creator" },
      ],
      order: [["start", "ASC"]],
    });
    return appointments.map(AppointmentFactory.fromSequelize);
  }

  async create(input) {
    AppointmentValidator.create(input);
    const appointmentEntity = AppointmentFactory.create(input);
    const created = await Appointment.create(appointmentEntity);
    const withIncludes = await Appointment.findByPk(created.id, {
      include: [{ model: Patient, as: "patient" }, { model: User, as: "creator" }],
    });
    return AppointmentFactory.fromSequelize(withIncludes);
  }

  async update(id, input) {
    const seqAppt = await Appointment.findByPk(id, {
      include: [{ model: Patient, as: "patient" }],
    });
    if (!seqAppt) throw new NotFoundError("Appointment not found");

    if (input.status) {
      const normalized = input.status.trim().toUpperCase();
      if (["PACIENTE LLEGÓ", "PACIENTE LLEGO"].includes(normalized) && !seqAppt.arriveTime) {
        input.arriveTime = new Date();
      }
      if (["PROGRAMADA", "CONFIRMADA", "CANCELADA"].includes(normalized)) {
        input.arriveTime = null;
      }
    }

    await seqAppt.update(input);
    const updated = await Appointment.findByPk(id, {
      include: [{ model: Patient, as: "patient" }, { model: User, as: "creator" }],
    });
    return AppointmentFactory.fromSequelize(updated);
  }

  async delete(id) {
    const appt = await Appointment.findByPk(id);
    if (!appt) throw new NotFoundError("Appointment not found");
    await appt.destroy();
    return AppointmentFactory.fromSequelize(appt);
  }
}

export default new AppointmentService();