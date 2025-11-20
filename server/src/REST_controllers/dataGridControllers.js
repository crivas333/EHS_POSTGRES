import { Appointment, Patient } from "../models/index.js";

// GET all appointments
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      include: [{ model: Patient, attributes: ["id", "firstName", "lastName", "lastName2"] }],
      order: [["start", "ASC"]],
    });

    res.json({
      result: appointments,
      count: appointments.length,
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// CRUD appointments
export const crudAppointments = async (req, res, next) => {
  const { action, value, added = [], changed = [], deleted = [] } = req.body;

  try {
    // INSERT
    if (action === "insert" || (action === "batch" && added.length > 0)) {
      const events = action === "insert" ? [value] : added;
      for (const evt of events) {
        const appointment = await Appointment.create({
          type: evt.appointmentType,
          status: evt.appointmentStatus,
          start: evt.StartTime,
          end: evt.EndTime,
          patientId: evt.patient || null,
          fullName: evt.fullName || "",
          notRegistered: evt.noRegistered || null,
          description: evt.Description || null,
          backgroundColor: evt.backgroundColor || null,
        });

        // Optional: push to patient appointments (Sequelize association)
        if (evt.patient) {
          const patient = await Patient.findByPk(evt.patient);
          if (patient) await patient.addAppointment(appointment);
        }
      }
    }

    // UPDATE
    if (action === "update" || (action === "batch" && changed.length > 0)) {
      const events = action === "update" ? [value] : changed;
      for (const evt of events) {
        const appointment = await Appointment.findByPk(evt.id);
        if (!appointment) continue;

        // Update fields
        await appointment.update({
          type: evt.appointmentType,
          status: evt.appointmentStatus,
          start: evt.StartTime,
          end: evt.EndTime,
          patientId: evt.patient || null,
          fullName: evt.fullName || "",
          notRegistered: evt.noRegistered || null,
          description: evt.Description || null,
          backgroundColor: evt.backgroundColor || null,
        });
      }
    }

    // DELETE
    if (action === "remove" || (action === "batch" && deleted.length > 0)) {
      const events = action === "remove" ? [{ id: req.body.key }] : deleted;
      for (const evt of events) {
        const appointment = await Appointment.findByPk(evt.id);
        if (!appointment) continue;

        // Remove association from patient if exists
        if (appointment.patientId) {
          const patient = await Patient.findByPk(appointment.patientId);
          if (patient) await patient.removeAppointment(appointment);
        }

        await appointment.destroy();
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error in CRUD appointments:", err);
    res.status(500).json({ error: "Failed to process appointments" });
  }
};
