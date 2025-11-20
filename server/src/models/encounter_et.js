import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Encounter_et = sequelize.define(
  "Encounter_et",
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

  

    odSph1: { type: DataTypes.STRING(30), field: "od_sph_1", allowNull: true },
    odCyl1: { type: DataTypes.STRING(30), field: "od_cyl_1", allowNull: true },
    odAx1: { type: DataTypes.STRING(30), field: "od_ax_1", allowNull: true },
    oiSph1: { type: DataTypes.STRING(30), field: "oi_sph_1", allowNull: true },
    oiCyl1: { type: DataTypes.STRING(30), field: "oi_cyl_1", allowNull: true },
    oiAx1: { type: DataTypes.STRING(30), field: "oi_ax_1", allowNull: true },
    pd1: { type: DataTypes.STRING(30), field: "pd_1", allowNull: true },

    odSph2: { type: DataTypes.STRING(30), field: "od_sph_2", allowNull: true },
    odCyl2: { type: DataTypes.STRING(30), field: "od_cyl_2", allowNull: true },
    odAx2: { type: DataTypes.STRING(30), field: "od_ax_2", allowNull: true },
    oiSph2: { type: DataTypes.STRING(30), field: "oi_sph_2", allowNull: true },
    oiCyl2: { type: DataTypes.STRING(30), field: "oi_cyl_2", allowNull: true },
    oiAx2: { type: DataTypes.STRING(30), field: "oi_ax_2", allowNull: true },
    pd2: { type: DataTypes.STRING(30), field: "pd_2", allowNull: true },

    odSph3: { type: DataTypes.STRING(30), field: "od_sph_3", allowNull: true },
    odCyl3: { type: DataTypes.STRING(30), field: "od_cyl_3", allowNull: true },
    odAx3: { type: DataTypes.STRING(30), field: "od_ax_3", allowNull: true },
    oiSph3: { type: DataTypes.STRING(30), field: "oi_sph_3", allowNull: true },
    oiCyl3: { type: DataTypes.STRING(30), field: "oi_cyl_3", allowNull: true },
    oiAx3: { type: DataTypes.STRING(30), field: "oi_ax_3", allowNull: true },
    pd3: { type: DataTypes.STRING(30), field: "pd_3", allowNull: true },
    addIntrm: { type: DataTypes.STRING(30), field: "add_intrm", allowNull: true },
    addRead: { type: DataTypes.STRING(30), field: "add_read", allowNull: true },

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
    modelName: "Encounter_et",
    tableName: "eye_test",
    timestamps: true,
    underscored: true,
  }
);

export default Encounter_et;
