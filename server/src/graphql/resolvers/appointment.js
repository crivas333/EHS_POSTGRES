import { Appointment, Patient, User,Encounter } from "../../models/index.js";
import { Op } from "sequelize";
import { GraphQLError } from "graphql";
import { statusToColor } from "../../utils/statusToColor.js";

// -----------------------------
// Helper: format appointment consistently
// -----------------------------
export function formatAppointment(a) {
  if (!a) return null;

  const patient = a.patient || null;

  const fullName = patient
    ? `${patient.lastName || ""}${
        patient.lastName2 ? " " + patient.lastName2 : ""
      }, ${patient.firstName || ""}`.trim()
    : "NO REGISTRADO";

  const normalizedStatus = (a.status || "").trim().toUpperCase();

  return {
    id: a.id,
    fullName,
    idTypeNo: patient?.idTypeNo || "",
    patientId: patient?.id || null,
    type: a.type,
    status: a.status,
    start: a.start ? a.start.toISOString() : null,
    end: a.end ? a.end.toISOString() : null,
    arriveTime: a.arriveTime ? a.arriveTime.toISOString() : null,
    description: a.description,
    notRegistered: a.notRegistered,
    backgroundColor: statusToColor(normalizedStatus), // 🎨 Dynamic color
  };
}

export default {
  Query: {
    // -----------------------------
    // Get appointments by timeframe
    // -----------------------------
    async getAppointmentsByTimeframe(_, { start, end }) {
      try {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate) || isNaN(endDate)) {
          throw new GraphQLError("Invalid date range provided", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const appointments = await Appointment.findAll({
          where: {
            start: { [Op.gte]: startDate },
            end: { [Op.lte]: endDate },
          },
          include: [
            {
              model: Patient,
              as: "patient",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "lastName2",
                "idTypeNo",
              ],
            },
          ],
          order: [["start", "ASC"]],
        });

        return appointments.map(formatAppointment);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        throw new GraphQLError("Failed to fetch appointments", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },

    // -----------------------------
    // Get appointments by patient
    // -----------------------------
    async getAppointmentsByPatientID(_, { patientId }) {
      try {
        const appointments = await Appointment.findAll({
          where: { patientId: parseInt(patientId, 10) },
          include: [
            {
              model: Patient,
              as: "patient",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "lastName2",
                "idTypeNo",
              ],
            },
          ],
          order: [["start", "ASC"]],
        });

        if (!appointments) return [];
        return appointments.map(formatAppointment);
      } catch (err) {
        console.error("Error fetching appointments by patient ID:", err);
        throw new GraphQLError("Failed to fetch appointments by patient ID", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },

    // -----------------------------
    // Get appointments by patient & timeframe
    // -----------------------------
    async getAppointmentsByPatientIDAndTimeframe(_, { patientId, start, end }) {
      try {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate) || isNaN(endDate)) {
          throw new GraphQLError("Invalid date range provided", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const appointments = await Appointment.findAll({
          where: {
            patientId: parseInt(patientId, 10),
            start: { [Op.gte]: startDate },
            end: { [Op.lte]: endDate },
          },
          include: [
            {
              model: Patient,
              as: "patient",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "lastName2",
                "idTypeNo",
              ],
            },
          ],
          order: [["start", "ASC"]],
        });

        return appointments.map(formatAppointment);
      } catch (err) {
        console.error("Error fetching appointments by patient and timeframe:", err);
        throw new GraphQLError("Failed to fetch appointments", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },
  },

  Mutation: {
    // -----------------------------
    // Add appointment
    // -----------------------------
    addAppointment: async (_, { input }) => {
      console.log("addAppointment-input:", input);
      try {
        const cleanInput = { ...input };
        if (cleanInput.patientId)
          cleanInput.patientId = parseInt(cleanInput.patientId, 10);

        cleanInput.creatorId =
          input.creatorId && !isNaN(input.creatorId)
            ? parseInt(input.creatorId, 10)
            : null;

        const arrivedStatus = "PACIENTE LLEGÓ";
        if (cleanInput.status === arrivedStatus) {
          cleanInput.arriveTime = new Date().toISOString();
        }

        const appointment = await Appointment.create(cleanInput);

        const fullRecord = await Appointment.findByPk(appointment.id, {
          include: [
            {
              model: Patient,
              as: "patient",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "lastName2",
                "idTypeNo",
              ],
            },
            {
              model: User,
              as: "creator",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        });

        if (fullRecord.patientId && !fullRecord.patient) {
          fullRecord.patient = await Patient.findByPk(fullRecord.patientId);
        }

        return formatAppointment(fullRecord);
      } catch (err) {
        console.error("Error creating appointment:", err);
        throw new GraphQLError("Failed to create appointment", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },

    // -----------------------------
    // Update appointment
    // -----------------------------
    updateAppointment: async (_, { id, input }) => {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new GraphQLError("Appointment not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (input.patientId) input.patientId = parseInt(input.patientId, 10);
      if (input.creatorId) input.creatorId = parseInt(input.creatorId, 10);

      const arrivedStatuses = ["PACIENTE LLEGÓ", "PACIENTE LLEGO"];
      const clearStatuses = [
        "PROGRAMADA",
        "CONFIRMADA",
        "REPROGRAMADA",
        "CANCELADA",
      ];

      if (input.status) {
        const normalizedStatus = input.status.trim().toUpperCase();

        if (arrivedStatuses.includes(normalizedStatus) && !appointment.arriveTime) {
          input.arriveTime = new Date().toISOString();
        }

        if (clearStatuses.includes(normalizedStatus) && appointment.arriveTime !== null) {
          input.arriveTime = null;
        }
         // 2️⃣ Create encounter when physician starts the consultation
        //if (normalized === "EN ATENCIÓN" || normalized === "EN ATENCION") {
        if (normalizedStatus === "EN ATENCIÓN" || normalizedStatus === "EN ATENCION") {  
          console.log("EN ATENCIÓN");
          const existingEncounter = await Encounter.findOne({
            where: { appointmentId: appointment.id },
          });

          if (!existingEncounter) {
            await Encounter.create({
              appointmentId: appointment.id,
              patientId: appointment.patientId,
              creatorId: input.creatorId || null,
              start: new Date(),
              end: new Date(), // placeholder; will be updated on save
              encounterType: "CONSULTA",
              consultReason: "",
            });
            console.log(`✅ Encounter created for appointment #${appointment.id}`);
          }
        }
      }
      
      await appointment.update(input);

      const updated = await Appointment.findByPk(id, {
        include: [
          {
            model: Patient,
            as: "patient",
            attributes: ["id", "firstName", "lastName", "lastName2", "idTypeNo"],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      return formatAppointment(updated);
    },

    // -----------------------------
    // ✅ Update appointment status only
    // -----------------------------
    updateAppointmentStatus: async (_, { id, status }) => {
      const appointment = await Appointment.findByPk(id);
      console.log("appointment-updateAppointmentStatus: ",appointment);
      if (!appointment) {
        throw new GraphQLError("Appointment not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const normalizedStatus = status.trim().toUpperCase();
      await appointment.update({ status: normalizedStatus });

      return formatAppointment(appointment);
    },

    // -----------------------------
    // Delete appointment
    // -----------------------------
    deleteAppointment: async (_, { id }) => {
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Patient,
            as: "patient",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "lastName2",
              "idTypeNo",
            ],
          },
        ],
      });
      if (!appointment)
        throw new GraphQLError("Appointment not found", {
          extensions: { code: "NOT_FOUND" },
        });

      await appointment.destroy();
      return formatAppointment(appointment);
    },
  },
};
