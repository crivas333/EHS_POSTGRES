import { Role, RoleHierarchy } from "./role.enum.js";

export class User {
  constructor(data) {
    this.id = data.id;
    this.userName = data.userName || data.user_name;
    this.email = data.email;
    this.firstName = data.firstName || data.first_name;
    this.lastName = data.lastName || data.last_name;
    this.role = data.role || Role.RECEPTIONIST;
    this.isActive = data.isActive ?? data.is_active ?? true;
    this.passwordHash = data.passwordHash || data.password_hash;
    this.createdAt = data.createdAt || data.created_at;
    this.updatedAt = data.updatedAt || data.updated_at;
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
    // FIX: Use password_hash (snake_case) to match Sequelize model
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      user_name: this.userName,
      email: this.email,
      password_hash: this.passwordHash,  // ← CHANGE THIS LINE to snake_case
      role: this.role,
      is_active: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}