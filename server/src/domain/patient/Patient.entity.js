// src/domain/patient/Patient.entity.js
import { differenceInYears, differenceInMonths } from "date-fns";

export class Patient {
  constructor(data) {
    const normalizeDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return isNaN(d.getTime()) ? null : d;
    };

    // Direct property assignment
    Object.assign(this, {
      id: data.id,
      lastName: data.lastName || null,
      lastName2: data.lastName2 || null,
      firstName: data.firstName || null,
      idType: data.idType || null,
      idTypeNo: data.idTypeNo || null,
      gender: data.gender || null,
      phone1: data.phone1 || null,
      phone2: data.phone2 || null,
      email: data.email || null,
      address: data.address || null,
      occupation: data.occupation || null,
      insurance1: data.insurance1 || null,
      gName: data.gName || null,
      gPhone1: data.gPhone1 || null,
      gPhone2: data.gPhone2 || null,
      gRelation: data.gRelation || null,
      bloodType: data.bloodType || null,
      marital: data.marital || null,
      religion: data.religion || null,
      referral: data.referral || null,
    });

    // Handle dates separately
    this.birthDay = normalizeDate(data.birthDay);
    this.registDate = normalizeDate(data.registDate);
    this.createdAt = normalizeDate(data.createdAt) || new Date();
    this.updatedAt = normalizeDate(data.updatedAt) || new Date();
  }

  get fullName() {
    const ln = this.lastName || "";
    const ln2 = this.lastName2 ? ` ${this.lastName2}` : "";
    const fn = this.firstName || "";
    return `${ln}${ln2}, ${fn}`.trim();
  }

  get ageYears() {
    return this.birthDay ? differenceInYears(new Date(), this.birthDay) : null;
  }

  get ageMonths() {
    return this.birthDay ? differenceInMonths(new Date(), this.birthDay) % 12 : null;
  }

  isMinor() {
    return this.ageYears !== null && this.ageYears < 18;
  }
  
  toJSON() {
    return {
      ...this,
      fullName: this.fullName,
      ageYears: this.ageYears,
      ageMonths: this.ageMonths,
    };
  }
}
