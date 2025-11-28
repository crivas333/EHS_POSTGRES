export const Role = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  RECEPTIONIST: "RECEPTIONIST",
  PHARMACY: "PHARMACY",
  LAB: "LAB",
};

export const RoleHierarchy = {
  [Role.ADMIN]: 100,
  [Role.DOCTOR]: 80,
  [Role.NURSE]: 60,
  [Role.RECEPTIONIST]: 40,
  [Role.PHARMACY]: 30,
  [Role.LAB]: 30,
};