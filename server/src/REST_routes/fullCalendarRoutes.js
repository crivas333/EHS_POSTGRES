import express from "express";
import {
  searchPatients,
  getAppointments,
  crudAppointments,
} from "../REST_controllers/fullCalendarControllers.js";

const router = express.Router();

// REST routes
router.route("/patients").post(searchPatients);

router.route("/crud").post(crudAppointments);

// changed from .post() to .get() ✅
router.route("/getDataFull").get(getAppointments);

router.route("/crud/:batch").post(crudAppointments);

export default router;
