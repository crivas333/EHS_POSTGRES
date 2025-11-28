// src/domain/patient/Patient.validator.js
import { ValidationError } from "../shared/index.js";

export const PatientValidator = {
  searchTerm(term) {
    if (!term || typeof term !== "string" || term.trim().length < 2) {
      throw new ValidationError("Search term must be at least 2 characters");
    }
    return term.trim();
  },

  combinedSearch({ lastName, lastName2, firstName }) {
    const hasValid =
      (lastName && lastName.trim().length >= 2) ||
      (lastName2 && lastName2.trim().length >= 2) ||
      (firstName && firstName.trim().length >= 2);

    if (!hasValid) {
      throw new ValidationError(
        "Debe proporcionar al menos un término de búsqueda válido (mínimo 2 caracteres)"
      );
    }
  },
};