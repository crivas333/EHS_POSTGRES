// src/services/patient.service.js
import { Patient } from "../models/index.js";
import { Op } from "sequelize";
import { GraphQLError } from "graphql";

class PatientService {

  // -----------------------------
  // ✔ Unified safe "not found" handler
  // -----------------------------
  _assertFound(entity, message = "Not found") {
    if (!entity) {
      throw new GraphQLError(message, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return entity;
  }

  // -----------------------------
  // ✔ Cleans input: "" → null, date strings → Date
  // -----------------------------
  _sanitizeInput(input) {
    const clean = {};

    for (const key in input) {
      const value = input[key];

      // Convert empty string to null
      if (value === "") {
        clean[key] = null;
        continue;
      }

      // Convert birthDay to Date
      if (key === "birthDay" && value) {
        const dateObj = new Date(value);
        clean[key] = isNaN(dateObj) ? null : dateObj;
        continue;
      }

      clean[key] = value;
    }

    return clean;
  }

  // -----------------------------
  // 📌 BASIC QUERIES
  // -----------------------------
  async getAll() {
    return Patient.findAll();
  }

  async getById(id) {
    const patient = await Patient.findByPk(id);
    return this._assertFound(patient, "Patient not found");
  }

  // -----------------------------
  // 📌 SEARCH HELPERS
  // -----------------------------
  _validateSearchTerm(term) {
    if (!term || term.trim().length < 2) {
      throw new GraphQLError("Search term too short (min 2 chars)", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
  }

  _pagination(page = 1, limit = 20) {
    return {
      limit,
      offset: (page - 1) * limit,
    };
  }

  // -----------------------------
  // 🔍 Search: By Last Name
  // -----------------------------
  async searchByLastName(lastName, offset = 0, limit = 20) {
    this._validateSearchTerm(lastName);

    try {
      return Patient.findAll({
        where: { lastName: { [Op.iLike]: `%${lastName}%` } },
        order: [["lastName", "ASC"]],
        offset,
        limit,
      });
    } catch (err) {
      console.error("❌ searchByLastName error:", err);
      throw new GraphQLError("Database error", {
        extensions: { code: "DB_ERROR" },
      });
    }
  }

  // -----------------------------
  // 🔍 Search: By ANY name field
  // -----------------------------
  async searchByName(searchTerm, page = 1, limit = 20) {
    this._validateSearchTerm(searchTerm);

    const { offset } = this._pagination(page, limit);

    try {
      return Patient.findAll({
        where: {
          [Op.or]: [
            { lastName: { [Op.iLike]: `%${searchTerm}%` } },
            { firstName: { [Op.iLike]: `%${searchTerm}%` } },
            { idTypeNo: { [Op.iLike]: `%${searchTerm}%` } },
          ],
        },
        order: [["lastName", "ASC"]],
        offset,
        limit,
      });
    } catch (err) {
      console.error("❌ searchByName error:", err);
      throw new GraphQLError("Database error", {
        extensions: { code: "DB_ERROR" },
      });
    }
  }

  // -----------------------------
  // 🔍 Combined Search (multiple fields)
  // -----------------------------
  async searchCombined({ lastName, lastName2, firstName, page = 1, limit = 20 }) {
    const hasInput =
      (lastName && lastName.length >= 2) ||
      (lastName2 && lastName2.length >= 2) ||
      (firstName && firstName.length >= 2);

    if (!hasInput) {
      throw new GraphQLError(
        "Debe proporcionar al menos un término de búsqueda válido (mínimo 2 caracteres)",
        { extensions: { code: "BAD_USER_INPUT" } }
      );
    }

    const where = { [Op.and]: [] };

    if (lastName) where[Op.and].push({ lastName: { [Op.iLike]: `%${lastName}%` } });
    if (lastName2) where[Op.and].push({ lastName2: { [Op.iLike]: `%${lastName2}%` } });
    if (firstName) where[Op.and].push({ firstName: { [Op.iLike]: `%${firstName}%` } });

    const { offset } = this._pagination(page, limit);

    try {
      return Patient.findAll({
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
      console.error("❌ searchCombined error:", err);
      throw new GraphQLError("Unexpected DB error", {
        extensions: { code: "DB_ERROR" },
      });
    }
  }

  // -----------------------------
  // 🧬 CREATE
  // -----------------------------
  async create(patientInput) {
    if (!patientInput.lastName || !patientInput.firstName) {
      throw new GraphQLError("Missing required fields", {
        extensions: { code: "VALIDATION_ERROR" },
      });
    }

    const cleanInput = this._sanitizeInput(patientInput);
    return Patient.create(cleanInput);
  }

  // -----------------------------
  // 🧬 UPDATE
  // -----------------------------
  async update(id, patientInput) {
    const patient = await this.getById(id);

    const cleanInput = this._sanitizeInput(patientInput);
    return patient.update(cleanInput);
  }

  // -----------------------------
  // ❌ DELETE
  // -----------------------------
  async delete(id) {
    const patient = await this.getById(id);

    await patient.destroy();
    return patient;
  }
}

export default new PatientService();
