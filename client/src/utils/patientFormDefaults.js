
// src/utils/patientFormDefaults.js
import {
  getgenderCollection,
  getMaritalCollection,
  getbloodTypeCollection,
  getIdTypeCollection,
} from "@/services/configService.js";

export const initialPatientValues = {
  idType: "DNI",
  idTypeNo: "",
  firstName: "",
  lastName: "",
  lastName2: "",
  birthDay: "",
  gender: "",
  phone1: "",
  phone2: "",
  email: "",
  address: "",
  gName: "",
  gPhone1: "",
  gPhone2: "",
  gRelation: "",
  bloodType: "",
  marital: "",
  occupation: "",
  religion: "",
  referral: "",
};

// Prevent mutation — always use a fresh copy
export const getInitialPatientValues = () => ({ ...initialPatientValues });

// ✅ Bring in your configService dropdowns
export const patientDropdowns = {
  genders: getgenderCollection(),
  bloodTypes: getbloodTypeCollection(),
  maritals: getMaritalCollection(),
  idTypes: getIdTypeCollection(),
};
