// src/domain/patient/Patient.factory.js
import { Patient } from "./Patient.entity.js";
import { ValidationError } from "../shared/index.js";

const parseDate = (dateInput) => {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Invalid date: ${dateInput}`);
  }
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
      lastName2: input.lastName2?.trim(),

      // Identity
      idType: input.idType?.trim(),
      idTypeNo: input.idTypeNo?.trim(),

      // Dates
      birthDay: parseDate(input.birthDay),
      registDate: parseDate(input.registDate),

      // Contact
      phone1: input.phone1?.trim(),
      phone2: input.phone2?.trim(),
      email: input.email?.trim(),
      address: input.address?.trim(),
      occupation: input.occupation?.trim(),
      insurance1: input.insurance1?.trim(),

      // Guardian
      gName: input.gName?.trim(),
      gPhone1: input.gPhone1?.trim(),
      gPhone2: input.gPhone2?.trim(),
      gRelation: input.gRelation?.trim(),

      // Others
      gender: input.gender,
      bloodType: input.bloodType,
      marital: input.marital,
      religion: input.religion,
      referral: input.referral,
    });
  },

  fromSequelize(model) {
    if (!model) return null;

    const data = model.get({ plain: true });
    
    // Convert date strings to Date objects
    const ensureDate = (val) => val ? new Date(val) : null;
    data.birthDay = ensureDate(data.birthDay);
    data.registDate = ensureDate(data.registDate);
    data.createdAt = ensureDate(data.createdAt);
    data.updatedAt = ensureDate(data.updatedAt);

    return new Patient(data);
  },
};