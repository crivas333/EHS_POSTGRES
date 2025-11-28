// src/services/patient.service.js
import { Op } from "sequelize";
import { GraphQLError } from "graphql";
import { Patient } from "../models/index.js";

import {
  PatientFactory,
  PatientValidator,
} from "../domain/patient/index.js";
import { NotFoundError } from "../domain/shared/index.js";

class PatientService {
  _pagination(page = 1, limit = 20) {
    return { offset: (page - 1) * limit, limit };
  }

  // GET ALL
  async getAll() {
    const patients = await Patient.findAll();
    return patients.map((p) => PatientFactory.fromSequelize(p));
  }

  // GET BY ID
  async getById(id) {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      throw new NotFoundError(`Patient with id ${id} not found`);
    }
    return PatientFactory.fromSequelize(patient);
  }

  // SEARCH BY NAME (free text)
  async searchByName(searchTerm, page = 1, limit = 20) {
    const term = PatientValidator.searchTerm(searchTerm);
    const { offset, limit: lim } = this._pagination(page, limit);

    const results = await Patient.findAll({
      where: {
        [Op.or]: [
          { lastName: { [Op.iLike]: `%${term}%` } },
          { firstName: { [Op.iLike]: `%${term}%` } },
          { idTypeNo: { [Op.iLike]: `%${term}%` } },
        ],
      },
      order: [["lastName", "ASC"]],
      offset,
      limit: lim,
    });

    return results.map((p) => PatientFactory.fromSequelize(p));
  }

  // SEARCH COMBINED (by lastName, lastName2, firstName)
  async searchCombined({ lastName, lastName2, firstName, page = 1, limit = 20 }) {
    PatientValidator.combinedSearch({ lastName, lastName2, firstName });
    const { offset, limit: lim } = this._pagination(page, limit);

    const where = { [Op.and]: [] };
    if (lastName) where[Op.and].push({ lastName: { [Op.iLike]: `%${lastName.trim()}%` } });
    if (lastName2) where[Op.and].push({ lastName2: { [Op.iLike]: `%${lastName2.trim()}%` } });
    if (firstName) where[Op.and].push({ firstName: { [Op.iLike]: `%${firstName.trim()}%` } });

    const results = await Patient.findAll({
      where,
      order: [
        ["lastName", "ASC"],
        ["lastName2", "ASC"],
        ["firstName", "ASC"],
      ],
      offset,
      limit: lim,
    });

    return results.map((p) => PatientFactory.fromSequelize(p));
  }

  // CREATE
  async create(patientInput) {
    const patientEntity = PatientFactory.create(patientInput);
    const created = await Patient.create(patientEntity);
    return PatientFactory.fromSequelize(created);
  }

  // UPDATE - FIXED
  async update(id, patientInput) {
    const sequelizePatient = await Patient.findByPk(id);
    if (!sequelizePatient) {
      throw new NotFoundError(`Patient with id ${id} not found`);
    }

    await sequelizePatient.update(patientInput);
    return PatientFactory.fromSequelize(sequelizePatient);
  }

  // DELETE - FIXED
  async delete(id) {
    const sequelizePatient = await Patient.findByPk(id);
    if (!sequelizePatient) {
      throw new NotFoundError(`Patient with id ${id} not found`);
    }

    await sequelizePatient.destroy();
    return PatientFactory.fromSequelize(sequelizePatient);
  }
}

export default new PatientService();