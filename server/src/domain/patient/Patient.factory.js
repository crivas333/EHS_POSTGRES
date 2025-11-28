// src/domain/patient/Patient.factory.js
import { Patient } from "./Patient.entity.js";
import { ValidationError } from "../shared/index.js";

// Robust date parser that accepts ISO strings, Date objects, etc.
const parseDate = (dateInput) => {
  if (!dateInput) return null;

  // Handle string, Date, or number
  const date = new Date(dateInput);

  // Critical: Check if it's a valid date
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Invalid date provided: ${JSON.stringify(dateInput)}`);
  }

  // Return proper Date object (PostgreSQL will accept it)
  return date;
};

export const PatientFactory = {
  create(input) {
    if (!input.lastName?.trim() || !input.firstName?.trim()) {
      throw new ValidationError("Last name and first name are required");
    }

    return new Patient({
      // Names
      lastName: input.lastName.trim(),
      firstName: input.firstName.trim(),
      lastName2: input.lastName2?.trim() || null,

      // Identity
      idType: input.idType?.trim() || null,
      idTypeNo: input.idTypeNo?.trim() || null,

      // Dates — NOW SAFE
      birthDay: parseDate(input.birthDay),
      registDate: parseDate(input.registDate),

      // Contact
      phone1: input.phone1?.trim() || null,
      phone2: input.phone2?.trim() || null,
      email: input.email?.trim() || null,
      address: input.address?.trim() || null,
      occupation: input.occupation?.trim() || null,
      insurance1: input.insurance1?.trim() || null,

      // Guardian
      gName: input.gName?.trim() || null,
      gPhone1: input.gPhone1?.trim() || null,
      gPhone2: input.gPhone2?.trim() || null,
      gRelation: input.gRelation?.trim() || null,

      // Others
      gender: input.gender || null,
      bloodType: input.bloodType || null,
      marital: input.marital || null,
      religion: input.religion || null,
      referral: input.referral || null,
    });
  },

  fromSequelize(model) {
    if (!model) return null;

    const data = model.get({ plain: true });

    // Ensure all dates are real Date objects
    const ensureDate = (val) => (val ? new Date(val) : null);
    data.birthDay = ensureDate(data.birthDay);
    data.registDate = ensureDate(data.registDate);
    data.createdAt = ensureDate(data.createdAt);
    data.updatedAt = ensureDate(data.updatedAt);

    return new Patient(data);
  },
};