
// server/src/graphql/resolvers/index.js
import auth from "./auth.js";           // ← NEW: JWT + Domain Auth
import patient from "./patient.js";
import appointment from "./appointment.js";
import encounter from "./encounter.js";
import applicationFields from "./applicationFields.js";
import date from "./myDate.js";

// OLD user.js REMOVED — it was session-based auth

export default [
  date,
  auth,              // ← This replaces user.js
  patient,
  appointment,
  encounter,
  applicationFields,
];


