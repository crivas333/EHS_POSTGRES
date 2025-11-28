// src/domain/patient/Patient.entity.js
import { differenceInYears, differenceInMonths } from "date-fns";

export class Patient {
  constructor(data) {
    // CRITICAL: Normalize all dates to UTC ISO strings or valid Date objects
    const normalizeDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return isNaN(d.getTime()) ? null : d; // This prevents Invalid Date
    };

    this.id = data.id;
    this.lastName = data.lastName || null;
    this.lastName2 = data.lastName2 || null;
    this.firstName = data.firstName || null;
    this.idType = data.idType || null;
    this.idTypeNo = data.idTypeNo || null;

    // DO NOT do new Date() here blindly — use normalizeDate
    this.birthDay = normalizeDate(data.birthDay);
    this.registDate = normalizeDate(data.registDate);
    this.createdAt = normalizeDate(data.createdAt) || new Date();
    this.updatedAt = normalizeDate(data.updatedAt) || new Date();

    // Rest of fields
    this.gender = data.gender || null;
    this.phone1 = data.phone1 || null;
    this.phone2 = data.phone2 || null;
    this.email = data.email || null;
    this.address = data.address || null;
    this.occupation = data.occupation || null;
    this.insurance1 = data.insurance1 || null;
    this.gName = data.gName || null;
    this.gPhone1 = data.gPhone1 || null;
    this.gPhone2 = data.gPhone2 || null;
    this.gRelation = data.gRelation || null;
    this.bloodType = data.bloodType || null;
    this.marital = data.marital || null;
    this.religion = data.religion || null;
    this.referral = data.referral || null;
  }
  get fullName() {
  const ln = this.lastName || "";
  const ln2 = this.lastName2 ? ` ${this.lastName2}` : "";
  const fn = this.firstName || "";
  return `${ln}${ln2}, ${fn}`.trim();
}

get ageYears() {
  if (!this.birthDay) return null;
  return differenceInYears(new Date(), this.birthDay);
}

get ageMonths() {
  if (!this.birthDay) return null;
  return differenceInMonths(new Date(), this.birthDay) % 12;
}

isMinor() {
  return this.ageYears !== null && this.ageYears < 18;
}
  
  toJSON() {
    return {
      id: this.id,
      lastName: this.lastName,
      lastName2: this.lastName2,
      firstName: this.firstName,
      fullName: this.fullName,
      idType: this.idType,
      idTypeNo: this.idTypeNo,
      birthDay: this.birthDay,
      ageYears: this.ageYears,
      ageMonths: this.ageMonths,
      gender: this.gender,
      phone1: this.phone1,
      phone2: this.phone2,
      email: this.email,
      address: this.address,
      occupation: this.occupation,
      insurance1: this.insurance1,
      gName: this.gName,
      gPhone1: this.gPhone1,
      gPhone2: this.gPhone2,
      gRelation: this.gRelation,
      bloodType: this.bloodType,
      marital: this.marital,
      religion: this.religion,
      referral: this.referral,
      registDate: this.registDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}