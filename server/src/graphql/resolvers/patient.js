import { Patient } from "../../models/index.js";
import { differenceInYears, differenceInMonths } from "date-fns";
import { Op } from "sequelize";
import { GraphQLError } from "graphql";

export default {
  Query: {
    patients: async () => Patient.findAll(),

    patient: async (_, { id }) => {
      const patient = await Patient.findByPk(id);
      if (!patient) {
        throw new GraphQLError("Patient not found", { extensions: { code: "NOT_FOUND" } });
      }
      return patient;
    },

    searchPatientsByLastName: async (_, { lastName, offset = 0, limit = 20 }) => {
      try {
        if (!lastName || lastName.trim().length < 2) {
          throw new GraphQLError("Search term too short", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const patients = await Patient.findAll({
          where: {
            lastName: { [Op.iLike]: `%${lastName.trim()}%` },
          },
          order: [["lastName", "ASC"]],
          offset,
          limit,
        });

        return patients ?? [];
      } catch (err) {
        console.error("❌ Sequelize search error:", err);
        if (err instanceof GraphQLError) throw err;
        throw new GraphQLError("Unexpected database error", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },

    searchPatientsByName: async (_, { searchTerm, page = 1, limit = 20 }) => {
      try {
        if (!searchTerm || searchTerm.trim().length < 2) {
          throw new GraphQLError("Search term too short", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const offset = (page - 1) * limit;

        const patients = await Patient.findAll({
          where: {
            [Op.or]: [
              { lastName: { [Op.iLike]: `%${searchTerm.trim()}%` } },
              { firstName: { [Op.iLike]: `%${searchTerm.trim()}%` } },
              { idTypeNo: { [Op.iLike]: `%${searchTerm.trim()}%` } },
            ],
          },
          order: [["lastName", "ASC"]],
          limit,
          offset,
        });

        return patients ?? [];
      } catch (err) {
        console.error("❌ Sequelize search error:", err);
        if (err instanceof GraphQLError) throw err;
        throw new GraphQLError("Unexpected database error", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },
    searchCombined: async (_, { lastName, lastName2, firstName, page = 1, limit = 20 }) => {
      try {
        const hasValidInput =
          (lastName && lastName.trim().length >= 2) ||
          (lastName2 && lastName2.trim().length >= 2) ||
          (firstName && firstName.trim().length >= 2);

        if (!hasValidInput) {
          throw new GraphQLError("Debe proporcionar al menos un término de búsqueda válido (mínimo 2 caracteres)", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const offset = (page - 1) * limit;

        const whereConditions = { [Op.and]: [] };

        if (lastName) {
          whereConditions[Op.and].push({
            lastName: { [Op.iLike]: `%${lastName.trim()}%` },
          });
        }

        if (lastName2) {
          whereConditions[Op.and].push({
            lastName2: { [Op.iLike]: `%${lastName2.trim()}%` },
          });
        }

        if (firstName) {
          whereConditions[Op.and].push({
            firstName: { [Op.iLike]: `%${firstName.trim()}%` },
          });
        }

        const patients = await Patient.findAll({
          where: whereConditions,
          order: [
            ["lastName", "ASC"],
            ["lastName2", "ASC"],
            ["firstName", "ASC"],
          ],
          offset,
          limit,
        });

        return patients ?? [];
      } catch (err) {
        console.error("Sequelize searchCombined error:", err);
        if (err instanceof GraphQLError) throw err;
        throw new GraphQLError("Error inesperado en búsqueda combinada", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },
  },

  Mutation: {
    createPatient: async (_, { patientInput }) => {
      try {
        if (!patientInput.lastName || !patientInput.firstName) {
          throw new GraphQLError("Missing required fields", { extensions: { code: "VALIDATION_ERROR" } });
        }

        const cleanInput = {};
        for (const key in patientInput) {
          cleanInput[key] = patientInput[key] === "" ? null : patientInput[key];
        }

        if (cleanInput.birthDay) {
          const bd = new Date(cleanInput.birthDay);
          cleanInput.birthDay = isNaN(bd) ? null : bd;
        }

        return await Patient.create(cleanInput);
      } catch (err) {
        console.error("Sequelize error:", err);
        throw new GraphQLError(err.message, { extensions: { code: "DB_ERROR" } });
      }
    },

    updatePatient: async (_, { id, patientInput }) => {
      try {
        const patient = await Patient.findByPk(id);
        if (!patient) {
          throw new GraphQLError(`Patient with id ${id} not found`, { extensions: { code: "NOT_FOUND" } });
        }

        const cleanInput = {};
        for (const key in patientInput) {
          cleanInput[key] = patientInput[key] === "" ? null : patientInput[key];
        }

        return await patient.update(cleanInput);
      } catch (err) {
        console.error("Sequelize error:", err);
        throw new GraphQLError(err.message, { extensions: { code: "DB_ERROR" } });
      }
    },

    deletePatient: async (_, { id }) => {
      try {
        const patient = await Patient.findByPk(id);
        if (!patient) {
          throw new GraphQLError(`Patient with id ${id} not found`, { extensions: { code: "NOT_FOUND" } });
        }

        await patient.destroy();
        return patient;
      } catch (err) {
        console.error("Sequelize error:", err);
        throw new GraphQLError(err.message, { extensions: { code: "DB_ERROR" } });
      }
    },
  },

  Patient: {
    fullName: (patient) =>
      `${patient.lastName}${patient.lastName2 ? " " + patient.lastName2 : ""}, ${patient.firstName}`,

    ageYears: (patient) => {
      if (!patient.birthDay) return null;
      const bd = new Date(patient.birthDay);
      if (isNaN(bd)) return null;
      return differenceInYears(new Date(), bd);
    },

    ageMonths: (patient) => {
      if (!patient.birthDay) return null;
      const bd = new Date(patient.birthDay);
      if (isNaN(bd)) return null;
      return differenceInMonths(new Date(), bd) % 12;
    },
  },
};