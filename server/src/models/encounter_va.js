import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Encounter_va = sequelize.define(
  "Encounter_va",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    encounterId: {
      type: DataTypes.INTEGER,
      field: "encounter_id",
      allowNull: false,
   
    },

    appointmentId: {
      type: DataTypes.INTEGER,
      field: "appointment_id",
      allowNull: false,
      references: {
        model: "appointments",
        key: "id",
      },
    },

    patientId: {
      type: DataTypes.INTEGER,
      field: "patient_id",
      allowNull: true,
      references: {
        model: "patients",
        key: "id",
      },
    },

    visualNeeds: {
      type: DataTypes.TEXT,
      field: "visual_needs",
      allowNull: true,
    },

    odVaSc: { type: DataTypes.STRING(30), field: "od_va_sc", allowNull: true },
    oiVaSc: { type: DataTypes.STRING(30), field: "oi_va_sc", allowNull: true },
    odVaCc: { type: DataTypes.STRING(30), field: "od_va_cc", allowNull: true },
    oiVaCc: { type: DataTypes.STRING(30), field: "oi_va_cc", allowNull: true },
    odVaAe: { type: DataTypes.STRING(30), field: "od_va_ae", allowNull: true },
    oiVaAe: { type: DataTypes.STRING(30), field: "oi_va_ae", allowNull: true },

    odIop: { type: DataTypes.STRING(30), field: "od_iop", allowNull: true },
    oiIop: { type: DataTypes.STRING(30), field: "oi_iop", allowNull: true },

    comm1: { type: DataTypes.STRING(250), field: "comm_1", allowNull: true },
    comm2: { type: DataTypes.STRING(250), field: "comm_2", allowNull: true },
    lens1: { type: DataTypes.STRING(250), field: "lens_1", allowNull: true },
    lens2: { type: DataTypes.STRING(250), field: "lens_2", allowNull: true },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "Encounter_va",
    tableName: "visual_acuity",
    timestamps: true,
    underscored: true,
  }
);

export default Encounter_va;
