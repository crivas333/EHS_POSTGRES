// services/configService.js

// Static collections for demographic data
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

// Mapping between friendly labels and internal fieldType keys
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

// ✅ Shared utility: map label → fieldType
export const mapLabelToFieldType = (view, label) => {
  return fieldTypeMaps[view]?.[label] || null;
};

// ✅ Generate field collections dynamically based on view
export const getFieldCollections = (view) => {
  const mappings = fieldTypeMaps[view];
  if (!mappings) return [];

  return Object.entries(mappings).map(([label, fieldType], index) => ({
    id: fieldType,
    field: label,
  }));
};

// ✅ Extract field data options for a specific view + fieldType
export const getFieldsDataCollection = (data, fieldView, fieldType) => {
  return data
    .filter(
      (item) => item.fieldView === fieldView && item.fieldType === fieldType
    )
    .map((item) => ({
      id: item.id,
      field: item.fieldData,
    }));
};
