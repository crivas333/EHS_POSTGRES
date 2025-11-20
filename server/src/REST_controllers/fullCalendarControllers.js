// controllers/appointments.controller.js
import { Appointment, Patient, sequelize } from "../models/index.js";
import { Op } from "sequelize";

/**
 * POST /api/v1/transactions
 * Handles insert/update/remove/batch actions for FullCalendar
 */
export const crudAppointments = async (req, res) => {
  const { action, value, added, changed, deleted, key } = req.body;
  let eventData = [];

  try {
    // ---------- INSERT / BATCH add ----------
    if (action === "insert" || (action === "batch" && added?.length > 0)) {
      eventData = action === "insert" ? [value] : added;

      for (const ev of eventData) {
        await sequelize.transaction(async (t) => {
          // Let PostgreSQL auto-increment handle the ID unless you need a custom sequence
          await Appointment.create(
            {
              type: ev.type || "CONSULTA",
              status: ev.status || "PROGRAMADA",
              start: ev.start ? new Date(ev.start) : null,
              end: ev.end ? new Date(ev.end) : null,
              patientId: ev.patientId || null,        // ✅ consistent naming
              fullName: ev.fullName || null,
              notRegistered: ev.notRegistered || null,
              description: ev.description || null,
              backgroundColor: ev.backgroundColor || "#007bff",
              creator_id: ev.creator_id || null,
            },
            { transaction: t }
          );
        });
      }
    }

    // ---------- UPDATE / BATCH changed ----------
    if (action === "update" || (action === "batch" && changed?.length > 0)) {
      eventData = action === "update" ? [value] : changed;

      for (const ev of eventData) {
        await sequelize.transaction(async (t) => {
          const appointment = await Appointment.findOne({
            where: { id: ev.id || ev.appointmentId },
            transaction: t,
          });
          if (!appointment) return;

          Object.assign(appointment, {
            type: ev.type ?? appointment.type,
            status: ev.status ?? appointment.status,
            start: ev.start ? new Date(ev.start) : appointment.start,
            end: ev.end ? new Date(ev.end) : appointment.end,
            patientId: ev.patientId ?? appointment.patientId, // ✅ consistent
            fullName: ev.fullName ?? appointment.fullName,
            notRegistered: ev.notRegistered ?? appointment.notRegistered,
            description: ev.description ?? appointment.description,
            backgroundColor: ev.backgroundColor ?? appointment.backgroundColor,
          });

          await appointment.save({ transaction: t });
        });
      }
    }

    // ---------- REMOVE / BATCH deleted ----------
    if (action === "remove" || (action === "batch" && deleted?.length > 0)) {
      eventData = action === "remove" ? [{ id: key }] : deleted;

      for (const ev of eventData) {
        const id = ev.id || ev.appointmentId;
        if (id) {
          await Appointment.destroy({ where: { id } });
        }
      }
    }

    // ✅ Return original request to keep frontend sync
    return res.status(200).send(req.body);
  } catch (err) {
    console.error("crudAppointments error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


/**
 * GET /api/v1/transactions
 * Query appointments in a date range (?start=...&end=...)
 */
export const getAppointments = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "start and end query params required" });
    }

    const docs = await Appointment.findAll({
      where: {
        start: { [Op.gte]: new Date(start) },
        end: { [Op.lte]: new Date(end) },
      },
      include: [
        {
          model: Patient,
          as: "patient", // ✅ MUST match the alias in associations.js
          attributes: ["id", "firstName", "lastName", "lastName2"],
        },
      ],
      order: [["start", "ASC"]],
    });

    const resp = docs.map((a) => {
      const patient = a.patient; // ✅ lowercase, matches alias
      const fullName = patient
        ? `${patient.lastName}${patient.lastName2 ? " " + patient.lastName2 : ""}, ${patient.firstName}`
        : a.fullName || "";

      return {
        id: a.id,
        start: a.start,
        end: a.end,
        type: a.type,
        status: a.status,
        patientId: a.patientId,
        fullName,
        notRegistered: a.notRegistered,
        description: a.description,
        backgroundColor: a.backgroundColor,
      };
    });

    return res.status(200).json(resp);
  } catch (err) {
    console.error("getAppointments error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


/**
 * POST /api/v1/transactions/searchPatients
 * Body expected { where: [{ value: "<search string>" }] }
 */
export const searchPatients = async (req, res) => {
  try {
    // Ensure request has a search term
    const searchValue = req.body?.where?.[0]?.value?.trim();
    if (!searchValue) {
      return res.status(400).json({ error: "Search term required" });
    }

    // Perform case-insensitive partial match across multiple fields
    const patients = await Patient.findAll({
      where: {
        [Op.or]: [
          { lastName: { [Op.iLike]: `%${searchValue}%` } },
          { lastName2: { [Op.iLike]: `%${searchValue}%` } },
          { firstName: { [Op.iLike]: `%${searchValue}%` } },
          { historyId: { [Op.iLike]: `%${searchValue}%` } },
        ],
      },
      attributes: [
        "id",
        "historyId",
        "firstName",
        "lastName",
        "lastName2",
      ],
      order: [
        ["lastName", "ASC"],
        ["firstName", "ASC"],
      ],
      limit: 50,
    });

    if (!patients.length) {
      return res.status(200).json([]); // no matches found
    }

    // Optional: format results for the frontend
    const formatted = patients.map((p) => ({
      id: p.id,
      historyId: p.historyId,
      fullName: `${p.lastName}${p.lastName2 ? " " + p.lastName2 : ""}, ${p.firstName}`,
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("searchPatients error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

