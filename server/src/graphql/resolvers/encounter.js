import {
  User,
  Patient,
  Appointment,
  Encounter,
  Encounter_va,
  Encounter_et,
} from "../../models/index.js";
import { Op } from "sequelize";
import { GraphQLError } from "graphql";

// -----------------------------
// Helper: format encounter consistently
// -----------------------------
function formatEncounter(encounter) {
  return {
    id: encounter.id,
    patientId: encounter.patientId,
    appointmentId: encounter.appointmentId,
    start: encounter.start ? new Date(encounter.start).toISOString() : null,
    end: encounter.end ? new Date(encounter.end).toISOString() : null,
    encounterType: encounter.encounterType,
    consultReason: encounter.consultReason,
  };
}

// -----------------------------
// Helper: format optometry encounters
// -----------------------------
function formatEncounterVA(opt) {
  return {
    id: opt.id,
    encounterId: opt.encounterId, // ✅ Add this line
    appointmentId: opt.appointmentId,
    patientId: opt.patientId,
    visualNeeds: opt.visualNeeds,
    odVaSc: opt.odVaSc,
    oiVaSc: opt.oiVaSc,
    odVaCc: opt.odVaCc,
    oiVaCc: opt.oiVaCc,
    odIop: opt.odIop,
    oiIop: opt.oiIop,
    lens1: opt.lens1,
    lens2: opt.lens2,
    comm1: opt.comm1,
    comm2: opt.comm2,
    createdAt: opt.createdAt,
    updatedAt: opt.updatedAt,
  };
}

// -----------------------------
// 🆕 Helper: format eyetest encounters
// -----------------------------
function formatEncounterET(et) {
  return {
    id: et.id,
    encounterId: et.encounterId, // ✅ Add this line
    appointmentId: et.appointmentId,
    patientId: et.patientId,

    odSph1: et.odSph1,
    odCyl1: et.odCyl1,
    odAx1: et.odAx1,
    oiSph1: et.oiSph1,
    oiCyl1: et.oiCyl1,
    oiAx1: et.oiAx1,
    pd1: et.pd1,

    odSph2: et.odSph2,
    odCyl2: et.odCyl2,
    odAx2: et.odAx2,
    oiSph2: et.oiSph2,
    oiCyl2: et.oiCyl2,
    oiAx2: et.oiAx2,
    pd2: et.pd2,

    odSph3: et.odSph3,
    odCyl3: et.odCyl3,
    odAx3: et.odAx3,
    oiSph3: et.oiSph3,
    oiCyl3: et.oiCyl3,
    oiAx3: et.oiAx3,
    pd3: et.pd3,

    addIntermediate: et.addIntrm,
    addReading: et.addRead,

    createdAt: et.createdAt,
    updatedAt: et.updatedAt,
  };
}

export default {
  Query: {
    async getEncountersByPatientID(_, { id }) {
      try {
        const encounters = await Encounter.findAll({
          where: { patientId: parseInt(id, 10) },
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
          order: [["start", "DESC"]],
        });

        if (!encounters) return [];
        return encounters.map(formatEncounter);
      } catch (err) {
        console.error("Error fetching encounters by patient ID:", err);
        throw new GraphQLError("Failed to fetch encounters for this patient", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },

    async getEncountersByPatientIDandTimeFrame(_, { id, start, end }) {
      try {
        const whereClause = { patientId: parseInt(id, 10) };

        if (start && end) {
          whereClause.start = { [Op.between]: [new Date(start), new Date(end)] };
        } else if (start) {
          whereClause.start = { [Op.gte]: new Date(start) };
        } else if (end) {
          whereClause.start = { [Op.lte]: new Date(end) };
        }

        const encounters = await Encounter.findAll({
          where: whereClause,
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

        if (!encounters) return [];
        return encounters.map(formatEncounter);
      } catch (err) {
        console.error("Error fetching encounters by patient ID:", err);
        throw new GraphQLError("Failed to fetch encounters for this patient", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },

    // 🧿 Existing VA resolver
    async getEncountersVAByEncounterID(_, { id }) {
      console.log("EncounterID (VA):", id);
      try {
        const records = await Encounter_va.findAll({
          where: { encounterId: parseInt(id, 10) },
          order: [["created_at", "DESC"]],
        });

        if (!records) return [];
        return records.map(formatEncounterVA);
      } catch (err) {
        console.error("Error fetching  visual acuity (VA):", err);
        throw new GraphQLError("Error fetching  visual acuity (VA)", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },

    // 🆕 New ET resolver (Eye Test)
    async getEncountersETByEncounterID(_, { id }) {
      console.log("Encounter ID (ET):", id);
      try {
        const records = await Encounter_et.findAll({
          where: { encounterId: parseInt(id, 10) },
          order: [["created_at", "DESC"]],
        });

        if (!records) return [];
        return records.map(formatEncounterET);
      } catch (err) {
        console.error("Error fetching eye test:", err);
        throw new GraphQLError("Failed to fetch eye test encounters", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },
    // async getEncountersVAByAppointmentID(_, { id }) {
    //   console.log("AppointmentID (VA):", id);
    //   try {
    //     const records = await Encounter_va.findAll({
    //       where: { appointmentId: parseInt(id, 10) },
    //       order: [["created_at", "DESC"]],
    //     });

    //     if (!records) return [];
    //     return records.map(formatEncounterVA);
    //   } catch (err) {
    //     console.error("Error fetching optometry encounters (VA):", err);
    //     throw new GraphQLError("Failed to fetch optometry encounters", {
    //       extensions: { code: "DB_ERROR" },
    //     });
    //   }
    // },

    // // 🆕 New ET resolver (Eye Test)
    // async getEncountersETByAppointmentID(_, { id }) {
    //   console.log("AppointmentID (ET):", id);
    //   try {
    //     const records = await Encounter_et.findAll({
    //       where: { appointmentId: parseInt(id, 10) },
    //       order: [["created_at", "DESC"]],
    //     });

    //     if (!records) return [];
    //     return records.map(formatEncounterET);
    //   } catch (err) {
    //     console.error("Error fetching eye test encounters:", err);
    //     throw new GraphQLError("Failed to fetch eye test encounters", {
    //       extensions: { code: "DB_ERROR" },
    //     });
    //   }
    // },
  },

  Mutation: {
    addEncounter: async (_, { input }) => {
      try {
        const data = {
          ...input,
          patientId: parseInt(input.patientId, 10),
          appointmentId: input.appointmentId
            ? parseInt(input.appointmentId, 10)
            : null,
        };

        const encounter = await Encounter.create(data);
        return encounter;
      } catch (error) {
        console.error("Error creating encounter:", error);
        throw new GraphQLError("Failed to create encounter", {
          extensions: { code: "DB_ERROR", details: error.message },
        });
      }
    },
  },
};
