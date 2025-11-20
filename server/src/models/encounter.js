import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Encounter = sequelize.define(
  "Encounter",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
    },

    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    encounterType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "encounter_type",
    },

    consultReason: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "consult_reason",
    },

    sxSigns: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "sx_signs",
    },

    adnexa: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    anteriorSeg: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "anterior_seg",
    },

    lens: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    fundus: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    dx: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tx: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    plan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "creator_id",
    },

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
    modelName: "Encounter",
    tableName: "encounters",
    timestamps: true,
    underscored: true,
  }
);

export default Encounter;
