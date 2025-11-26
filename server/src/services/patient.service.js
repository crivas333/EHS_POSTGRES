
import { Patient } from "../models/index.js";
import { Op } from "sequelize";
import { GraphQLError } from "graphql";
import { differenceInYears, differenceInMonths } from "date-fns";

class PatientService {

  // -------------------------
  // 🔹 Query: Get all patients
  // -------------------------
  async getAll() {
    return Patient.findAll();
  }

  // -------------------------
  // 🔹 Query: Get one patient
  // -------------------------
  async getById(id) {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      throw new GraphQLError("Patient not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return patient;
  }

  // --------------------------------------
  // 🔹 Search (by lastName, by name, etc.)
  // --------------------------------------
  async searchByLastName(lastName, offset = 0, limit = 20) {
    if (!lastName || lastName.trim().length < 2) {
      throw new GraphQLError("Search term too short", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    try {
      return await Patient.findAll({
        where: {
          lastName: { [Op.iLike]: `%${lastName.trim()}%` },
        },
        order: [["lastName", "ASC"]],
        offset,
        limit,
      });
    } catch (err) {
      console.error("❌ searchByLastName error:", err);
      throw new GraphQLError("Unexpected database error", {
        extensions: { code: "DB_ERROR" },
      });
    }
  }

  async searchByName(searchTerm, page = 1, limit = 20) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new GraphQLError("Search term too short", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const offset = (page - 1) * limit;

    try {
      return await Patient.findAll({
        where: {
          [Op.or]: [
            { lastName: { [Op.iLike]: `%${searchTerm}%` } },
            { firstName: { [Op.iLike]: `%${searchTerm}%` } },
            { idTypeNo: { [Op.iLike]: `%${searchTerm}%` } },
          ],
        },
        order: [["lastName", "ASC"]],
        limit,
        offset,
      });
    } catch (err) {
      console.error("❌ searchByName error:", err);
      throw new GraphQLError("Unexpected database error", {
        extensions: { code: "DB_ERROR" },
      });
    }
  }

  async searchCombined({ lastName, lastName2, firstName, page = 1, limit = 20 }) {
    const hasValidInput =
      (lastName && lastName.trim().length >= 2) ||
      (lastName2 && lastName2.trim().length >= 2) ||
      (firstName && firstName.trim().length >= 2);

    if (!hasValidInput) {
      throw new GraphQLError(
        "Debe proporcionar al menos un término de búsqueda válido (mínimo 2 caracteres)",
        { extensions: { code: "BAD_USER_INPUT" } }
      );
    }

    const offset = (page - 1) * limit;

    const where = { [Op.and]: [] };

    if (lastName) where[Op.and].push({ lastName: { [Op.iLike]: `%${lastName}%` } });
    if (lastName2) where[Op.and].push({ lastName2: { [Op.iLike]: `%${lastName2}%` } });
    if (firstName) where[Op.and].push({ firstName: { [Op.iLike]: `%${firstName}%` } });

    try {
      return await Patient.findAll({
        where,
        order: [
          ["lastName", "ASC"],
          ["lastName2", "ASC"],
          ["firstName", "ASC"],
        ],
        offset,
        limit,
      });
    } catch (err) {
      console.error("❌ searchCombined:", err);
      throw new GraphQLError("Error inesperado en búsqueda combinada", {
        extensions: { code: "DB_ERROR" },
      });
    }
  }

  // -------------------------
  // 🔹 Mutation: Create patient
  // -------------------------
  async create(patientInput) {
    if (!patientInput.lastName || !patientInput.firstName) {
      throw new GraphQLError("Missing required fields", {
        extensions: { code: "VALIDATION_ERROR" },
      });
    }

    const cleanInput = {};
    for (const key in patientInput) {
      cleanInput[key] = patientInput[key] === "" ? null : patientInput[key];
    }

    if (cleanInput.birthDay) {
      const bd = new Date(cleanInput.birthDay);
      cleanInput.birthDay = isNaN(bd) ? null : bd;
    }

    return Patient.create(cleanInput);
  }

  // -------------------------
  // 🔹 Mutation: Update patient
  // -------------------------
  async update(id, patientInput) {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      throw new GraphQLError(`Patient with id ${id} not found`, {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const cleanInput = {};
    for (const key in patientInput) {
      cleanInput[key] = patientInput[key] === "" ? null : patientInput[key];
    }

    return patient.update(cleanInput);
  }

  // -------------------------
  // 🔹 Mutation: Delete patient
  // -------------------------
  async delete(id) {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      throw new GraphQLError(`Patient with id ${id} not found`, {
        extensions: { code: "NOT_FOUND" },
      });
    }

    await patient.destroy();
    return patient;
  }
}

export default new PatientService();
