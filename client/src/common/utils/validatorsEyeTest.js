// src/utils/validatorsEyeTest.js

/**
 * 🔍 Universal Eye Test Validator
 * Supports:
 * - Manifest Refraction
 * - Auto Refraction
 * - Final Prescription (Rx)
 * Includes validation for SPH, CYL, AX, ADD, PD, PRISM, and BASE fields.
 */

export function validateEyeTest(values) {
  const errors = {};

  // --- Helper: Numeric range ---
  const isValidNumber = (val, min, max) => {
    if (val === "" || val === null || val === undefined) return false;
    const num = parseFloat(val);
    return !isNaN(num) && num >= min && num <= max;
  };

  // --- Helper: Eye-level validation (OD / OS) ---
  const validateEye = (eyePrefix) => {
    const sph = values[`${eyePrefix}Sph1`] ?? values[`${eyePrefix}Sph`] ?? "";
    const cyl = values[`${eyePrefix}Cyl1`] ?? values[`${eyePrefix}Cyl`] ?? "";
    const ax = values[`${eyePrefix}Ax1`] ?? values[`${eyePrefix}Ax`] ?? "";
    const prism = values[`${eyePrefix}Prism`] ?? "";
    const base = values[`${eyePrefix}Base`] ?? "";

    // --- SPH (required, -20.00 to +20.00) ---
    if (!sph) errors[`${eyePrefix}Sph1`] = "Ingrese valor.";
    else if (!isValidNumber(sph, -20, 20))
      errors[`${eyePrefix}Sph1`] = "Rango SPH -20.00 a +20.00.";
    else errors[`${eyePrefix}Sph1`] = "";

    // --- CYL (optional, -6.00 to +6.00) ---
    if (cyl && !isValidNumber(cyl, -6, 6))
      errors[`${eyePrefix}Cyl1`] = "Rango CYL -6.00 a +6.00.";
    else errors[`${eyePrefix}Cyl1`] = "";

    // --- AX (optional, 0° to 180°) ---
    if (ax && !isValidNumber(ax, 0, 180))
      errors[`${eyePrefix}Ax1`] = "Rango AX 0° a 180°.";
    else errors[`${eyePrefix}Ax1`] = "";

    // --- PRISM (optional, 0.00 to 10.00Δ) ---
    if (prism && !isValidNumber(prism, 0, 10))
      errors[`${eyePrefix}Prism`] = "Rango Prism 0.00 a 10.00Δ.";
    else errors[`${eyePrefix}Prism`] = "";

    // --- BASE (optional, must be IN / OUT / UP / DOWN) ---
    if (base) {
      const normalized = base.trim().toUpperCase();
      const allowed = ["IN", "OUT", "UP", "DOWN"];
      if (!allowed.includes(normalized))
        errors[`${eyePrefix}Base`] = "Debe ser IN, OUT, UP o DOWN.";
      else errors[`${eyePrefix}Base`] = "";
    } else errors[`${eyePrefix}Base`] = "";
  };

  // --- Validate OD (Right Eye) and OS (Left Eye) ---
  validateEye("od");
  validateEye("oi"); // "oi" = OS (Left Eye)

  // --- ADD (Intermediate, Reading, Near): 0.00 to +4.00 ---
  const addFields = ["addIntrm", "addRead", "addNear"];
  addFields.forEach((f) => {
    if (values[f] && !isValidNumber(values[f], 0, 4))
      errors[f] = "Rango ADD 0.00 a +4.00.";
    else errors[f] = "";
  });

  // --- PD (Interpupillary Distance): 40–80 mm ---
  const pdFields = ["pd", "pd1", "pd2"];
  pdFields.forEach((f) => {
    if (values[f]) {
      if (!isValidNumber(values[f], 40, 80)) errors[f] = "Rango PD 40–80 mm.";
      else errors[f] = "";
    } else errors[f] = "";
  });

  // ✅ All clean?
  const isValid = Object.values(errors).every((x) => x === "");

  return { errors, isValid };
}

/**
 * 🎯 Specialized wrappers for semantic clarity
 * (They all reuse the same validator)
 */

export const validateManifestRefraction = validateEyeTest;
export const validateAutoRefraction = validateEyeTest;
export const validateFinalRx = validateEyeTest;
