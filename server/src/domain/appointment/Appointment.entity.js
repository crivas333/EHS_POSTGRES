// src/domain/appointment/Appointment.entity.js
import { formatISO } from "date-fns";

export class Appointment {
  constructor(data) {
    this.id = data.id;
    this.patientId = data.patientId || null;
    this.notRegistered = data.notRegistered?.trim() || null;
    this.type = data.type?.trim();
    this.status = data.status?.trim().toUpperCase();
    this.start = data.start ? new Date(data.start) : null;
    this.end = data.end ? new Date(data.end) : null;
    this.arriveTime = data.arriveTime ? new Date(data.arriveTime) : null;
    this.description = data.description?.trim() || null;
    this.creatorId = data.creatorId || null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

    // Virtuals
    this.patient = data.patient || null;
    this.creator = data.creator || null;
  }

  get fullName() {
    if (this.patient) {
      const ln2 = this.patient.lastName2 ? ` ${this.patient.lastName2}` : "";
      return `${this.patient.lastName || ""}${ln2}, ${this.patient.firstName || ""}`.trim();
    }
    return this.notRegistered || "NO REGISTRADO";
  }

  get backgroundColor() {
    const colors = {
      PROGRAMADA: "#3788d8",
      CONFIRMADA: "#28a745",
      "PACIENTE LLEGÓ": "#ffc107",
      "EN ATENCIÓN": "#fd7e14",
      FINALIZADA: "#17a2b8",
      CANCELADA: "#dc3545",
      REPROGRAMADA: "#6f42c1",
    };
    return colors[this.status] || "#6c757d";
  }

  get isArrived() {
    return ["PACIENTE LLEGÓ", "EN ATENCIÓN", "FINALIZADA"].includes(this.status);
  }

  get durationMinutes() {
    if (!this.start || !this.end) return 0;
    return Math.round((this.end - this.start) / (1000 * 60));
  }

  toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      fullName: this.fullName,
      notRegistered: this.notRegistered,
      idTypeNo: this.patient?.idTypeNo || "",
      type: this.type,
      status: this.status,
      start: this.start ? formatISO(this.start) : null,
      end: this.end ? formatISO(this.end) : null,
      arriveTime: this.arriveTime ? formatISO(this.arriveTime) : null,
      description: this.description,
      backgroundColor: this.backgroundColor,
      patient: this.patient,
      creator: this.creator,
    };
  }
}