// server/src/resolvers/index.js
import user from "./user.js";
import patient from "./patient.js";
import appointment from "./appointment.js";
import encounter from "./encounter.js";
import applicationFields from "./applicationFields.js";
import date from "./myDate.js";

export default [
  date,
  user,
  patient,
  appointment,
  encounter,
  applicationFields,
];


