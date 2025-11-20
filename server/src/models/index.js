// server/src/models/index.js

import { sequelize } from "../db.js";

import Patient from "./patient.js";
import Appointment from "./appointment.js";
import User from "./user.js";
import Encounter from "./encounter.js";
import Encounter_va from "./encounter_va.js";
import Encounter_et from "./encounter_et.js";


// -------------------------------
// 🔗 Define Associations
// -------------------------------

// 🧍‍♂️ Patient ↔ Appointment
Patient.hasMany(Appointment, {
  foreignKey: "patient_id",
  as: "appointments",
});

Appointment.belongsTo(Patient, {
  foreignKey: "patient_id",
  as: "patient",
});

// 👤 Appointment ↔ User (creator)
Appointment.belongsTo(User, {
  foreignKey: "creator_id",
  as: "creator",
});

// 👁️ Encounter ↔ Patient
Patient.hasMany(Encounter, {
  foreignKey: "patient_id",
  as: "encounters",
});

Encounter.belongsTo(Patient, {
  foreignKey: "patient_id",
  as: "patient",
});

// 📅 Encounter ↔ Appointment
Appointment.hasOne(Encounter, {
  foreignKey: "appointment_id",
  as: "encounter",
});

Encounter.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});

// 🧑‍⚕️ Encounter ↔ User (creator)
User.hasMany(Encounter, {
  foreignKey: "creator_id",
  as: "createdEncounters",
});

Encounter.belongsTo(User, {
  foreignKey: "creator_id",
  as: "creator",
});

// -------------------------------
// ✅ Export all models and sequelize
// -------------------------------
export { sequelize, User,Patient, Appointment, Encounter, Encounter_va, Encounter_et};

