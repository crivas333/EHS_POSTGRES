import { Role, RoleHierarchy } from "./role.enum.js";

export class User {
  constructor(data) {
    this.id = data.id;
    this.userName = data.userName?.trim().toLowerCase();
    this.email = data.email?.trim().toLowerCase();
    this.firstName = data.firstName?.trim();
    this.lastName = data.lastName?.trim();
    this.role = data.role || Role.RECEPTIONIST;
    this.isActive = data.isActive ?? true;
    // THIS IS THE KEY — MUST BE password_hash (snake_case)
    this.password_hash = data.password_hash;   // ← NOT passwordHash!

    //this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    //this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  hasRole(required) {
    if (this.role === Role.ADMIN) return true;
    return (RoleHierarchy[this.role] || 0) >= (RoleHierarchy[required] || 0);
  }

  can(permission) {
    const perms = {
      [Role.ADMIN]: ["*"],
      [Role.DOCTOR]: ["prescribe", "view_encounter", "edit_encounter"],
      [Role.NURSE]: ["edit_vitals"],
      [Role.RECEPTIONIST]: ["create_appointment", "check_in_patient"],
    };
    return perms[this.role]?.includes("*") || perms[this.role]?.includes(permission);
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.userName,
      email: this.email,
      password_hash: this.password_hash,   // ← MUST BE snake_case
      role: this.role,
      is_active: this.isActive,
      //createdAt: this.createdAt,
      //updatedAt: this.updatedAt,
    };
  }
}