
// src/graphql/resolvers/patient.js
import patientService from "../../services/patient.service.js";

export default {
  Query: {
    patients: () => patientService.getAll(),

    patient: (_, { id }) => patientService.getById(id),

    searchPatientsByLastName: (_, args) =>
      patientService.searchByLastName(args.lastName, args.offset, args.limit),

    searchPatientsByName: (_, args) =>
      patientService.searchByName(args.searchTerm, args.page, args.limit),

    searchCombined: (_, args) =>
      patientService.searchCombined(args),
  },

  Mutation: {
    createPatient: (_, { patientInput }) =>
      patientService.create(patientInput),

    updatePatient: (_, { id, patientInput }) =>
      patientService.update(id, patientInput),

    deletePatient: (_, { id }) =>
      patientService.delete(id),
  },

  Patient: {
    fullName: (p) => p.fullName,
    ageYears: (p) => p.ageYears,
    ageMonths: (p) => p.ageMonths,
  },
};
