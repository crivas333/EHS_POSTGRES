import express from "express";
import {
  getAppointments,
  crudAppointments,
} from "../REST_controllers/dataGridControllers.js";

const router = express.Router();

// Map REST endpoints
router.route("/DataSource").post(getAppointments);

router.route("/Insert").post(crudAppointments);

router.route("/Update").post(crudAppointments);

router.route("/Delete").post(crudAppointments);

export default router;
