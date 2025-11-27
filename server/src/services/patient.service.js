
import { Op } from "sequelize";
import { GraphQLError } from "graphql";
import { Patient } from "../models/index.js";

class PatientService {
  _pagination(page, limit) {
    return {
      offset: (page - 1) * limit,
      limit,
    };
  }

  _validateSearchTerm(term) {
    if (!term || typeof term !== "string" || term.trim().length < 2) {
      throw new GraphQLError("Search term too short", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    return term.trim();
  }
  async getAll() {
    const list = await Patient.findAll();
    return list.map((p) => this._toEntity(p));
  }

  async getById(id) {
    const patient = await Patient.findByPk(id);
    return (patient);
  }
  // ---- SAME as old resolver (the working one!) ----
  async searchByName(searchTerm, page = 1, limit = 20) {
    const term = this._validateSearchTerm(searchTerm);
    const { offset } = this._pagination(page, limit);

    try {
      return await Patient.findAll({
        where: {
          [Op.or]: [
            { lastName: { [Op.iLike]: `%${term}%` } },
            { firstName: { [Op.iLike]: `%${term}%` } },
            { idTypeNo: { [Op.iLike]: `%${term}%` } },
          ],
        },
        order: [["lastName", "ASC"]],
        offset,
        limit,
      });
    } catch (err) {
      console.error("searchByName error:", err);
      throw new GraphQLError("Database error", {
        extensions: { code: "DB_ERROR" },
      });
    }
  }

  // EXACT same logic as the working older resolver
  async searchCombined({ lastName, lastName2, firstName, page = 1, limit = 20 }) {
    const hasValid =
      (lastName && lastName.trim().length >= 2) ||
      (lastName2 && lastName2.trim().length >= 2) ||
      (firstName && firstName.trim().length >= 2);

    if (!hasValid) {
      throw new GraphQLError(
        "Debe proporcionar al menos un término de búsqueda válido (mínimo 2 caracteres)",
        { extensions: { code: "BAD_USER_INPUT" } }
      );
    }

    const { offset } = this._pagination(page, limit);

    const where = { [Op.and]: [] };

    if (lastName) where[Op.and].push({ lastName: { [Op.iLike]: `%${lastName.trim()}%` } });
    if (lastName2) where[Op.and].push({ lastName2: { [Op.iLike]: `%${lastName2.trim()}%` } });
    if (firstName) where[Op.and].push({ firstName: { [Op.iLike]: `%${firstName.trim()}%` } });

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
      console.error("searchCombined error:", err);
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

    //const cleanInput = this._sanitizeInput(patientInput);
    //return Patient.create(cleanInput);
    return Patient.create(patientInput);
  }
  // -----------------------------
  // 🧬 UPDATE
  // -----------------------------
  async update(id, patientInput) {
    const patient = await this.getById(id);

    //const cleanInput = this._sanitizeInput(patientInput);
    //return patient.update(cleanInput);
    return patient.update(patientInput);
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



// THIS FIXES THE ERROR
export default new PatientService();
