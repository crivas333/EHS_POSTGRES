// src/utils/validators.js

export function validatePatient(values) {
  const errors = {};

  // Basic name validation
  errors.firstName = values.firstName ? "" : "Ingrese Nombre.";
  errors.lastName = values.lastName ? "" : "Ingrese A. Paterno.";

  // Optional: Validate document fields
  if (!values.idTypeNo) errors.idTypeNo = "Ingrese Nro. Documento.";
  else if (!/^[A-Za-z0-9-]+$/.test(values.idTypeNo))
    errors.idTypeNo = "Formato inválido.";
  else errors.idTypeNo = "";

  // Optional: Email check
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Correo inválido.";
  else errors.email = "";

  // Optional: Phone check
  if (values.phone1 && !/^\+?\d{6,15}$/.test(values.phone1))
    errors.phone1 = "Teléfono inválido.";
  else errors.phone1 = "";

  const isValid = Object.values(errors).every((x) => x === "");
  return { errors, isValid };
}
