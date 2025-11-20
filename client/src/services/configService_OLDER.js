//import {useContext} from 'react'
//import { GlobalContext } from '@/context/GlobalState'

export const getgenderCollection = () => [
  { id: "1", field: "" },
  { id: "2", field: "MASCULINO" },
  { id: "3", field: "FEMENINO" },
];

export const getMaritalCollection = () => [
  { id: "1", field: "" },
  { id: "2", field: "SOLTERO(A)" },
  { id: "3", field: "CONVIVIENTE" },
  { id: "4", field: "CASADO(A)" },
  { id: "5", field: "DIVORSIADO(A)" },
  { id: "6", field: "VIUDO(A)" },
];

export const getbloodTypeCollection = () => [
  { id: "1", field: "A+" },
  { id: "2", field: "A-" },
  { id: "3", field: "B+" },
  { id: "4", field: "B-" },
  { id: "5", field: "AB+" },
  { id: "6", field: "AB-" },
  { id: "7", field: "O+" },
  { id: "8", field: "O-" },
];

export const getIdTypeCollection = () => [
  { id: "1", field: "DNI" },
  { id: "2", field: "PASAPORTE" },
  { id: "3", field: "CARNET_EXTRANJERÍA" },
  { id: "4", field: "OTRO" },
];

export const getEncounterFieldsCollection = () => [
  { id: "1", field: "Tipo de Visita" },
  { id: "2", field: "Estado" },
  { id: "3", field: "Tipo de Paciente" },
  { id: "4", field: "Tipo de Atención" },
  { id: "5", field: "Sensibilidad" },
  { id: "6", field: "Paquete de Servicios" },
  { id: "7", field: "Médico" },
  { id: "8", field: "Centro" },
];
export const getExamFieldsCollection = () => [
  { id: "1", field: "Tipo de Examen" },
  { id: "2", field: "Estado de Examen" },
];
export const getAppointmentFieldsCollection = () => [
  { id: "1", field: "Tipo de Cita" },
  { id: "2", field: "Estado de Cita" },
];

// services/configService.js
export const getFieldCollections = (
  applicationFields,
  view = "appointmentView"
) => {
  // Filter all fields with the given view (e.g., appointmentView)
  const fieldTypesSet = new Set();
  const collections = [];

  applicationFields.forEach((f) => {
    if (f.fieldView === view && !fieldTypesSet.has(f.fieldType)) {
      fieldTypesSet.add(f.fieldType);
      // You can map fieldType to a friendly name
      let label =
        f.fieldType === "appointmentType" ? "Tipo de Cita" : "Estado de Cita";
      collections.push({ id: f.fieldType, field: label });
    }
  });

  return collections.length
    ? collections
    : [
        { id: "appointmentType", field: "Tipo de Cita" },
        { id: "appointmentStatus", field: "Estado de Cita" },
      ];
};

export const getFieldsDataCollection = (data, fieldView, fieldType) => {
  const options = data
    .filter(
      (item) => item.fieldView === fieldView && item.fieldType === fieldType
    )
    .map((item) => ({
      id: item.id,
      field: item.fieldData,
    }));
  //console.log(options)
  return options;
};

// Mapping between friendly names and internal fieldType keys
export const fieldTypeMaps = {
  appointment: {
    "Tipo de Cita": "appointmentType",
    "Estado de Cita": "appointmentStatus",
  },
  encounter: {
    "Tipo de Visita": "encounterType",
    Estado: "encounterStatus",
    "Tipo de Paciente": "patientType",
    "Tipo de Atención": "careType",
    Sensibilidad: "sensitivity",
    "Paquete de Servicios": "servicePackage",
    Médico: "doctor",
    Centro: "center",
  },
  exam: {
    "Tipo de Examen": "examType",
    "Estado de Examen": "examStatus",
  },
};

// ✅ Shared utility function
export const mapLabelToFieldType = (view, label) => {
  return fieldTypeMaps[view]?.[label] || null;
};
