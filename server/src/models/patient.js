

// server/src/models/patient.js
import { DataTypes } from "sequelize";
import { sequelize}  from "../db.js";
import { differenceInYears, differenceInMonths } from "date-fns";

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      //field: "patient_id"
    },
     // Names
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "last_name",
    },
    lastName2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "last_name_2",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "first_name",
    },
       // Identity
    idType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "id_type",
    },
    idTypeNo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "id_type_no",
    },

    // Demographics
    birthDay: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "birth_day",
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "gender",
    },
     // Contact
    phone1: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "phone_1",
    },
    phone2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "phone_2",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insurance1: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "insurance_1",
    },
    // Guardian
    gName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "g_name",
    },
    gPhone1: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "g_phone_1",
    },
    gPhone2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "g_phone_2",
    },
    gRelation: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "g_relation",
    },

    bloodType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "blood_type",
    },
    marital: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    religion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Referral
    referral: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    

    // Virtuals
    // fullName: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     return `${this.lastName}${this.lastName ? " " + this.lastName2 : ""}, ${this.firstName}`;
    //   },
    // },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        const ln = this.lastName || "";
        const ln2 = this.lastName2 ? " " + this.lastName2 : "";
        const fn = this.firstName || "";
        return `${ln}${ln2 ? ln2 : ""}, ${fn}`.trim();
      },
    },

    ageYears: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.birthDay) return null;
        return differenceInYears(new Date(), new Date(this.birthDay));
      },
    },
    ageMonths: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.birthDay) return null;
        return differenceInMonths(new Date(), new Date(this.birthDay)) % 12;
      },
    },
    // Timestamps (SQL-first: DB manages them)
    registDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "regist_date",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "Patient",
    tableName: "patients",
    timestamps: true, //Due to SQL-first design
    underscored: true, // maps camelCase attributes to snake_case DB columns automatically
  }
);



export default Patient ;
