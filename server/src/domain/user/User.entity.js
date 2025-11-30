//server/src/domain/user/User.entity.js
import { Role, RoleHierarchy } from "./role.enum.js";

export class User {
  constructor(data) {
    // Handle both camelCase and snake_case field names
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
    return this.role === Role.ADMIN || 
           (RoleHierarchy[this.role] || 0) >= (RoleHierarchy[required] || 0);
  }

  can(permission) {
    const permissions = {
      [Role.ADMIN]: ["*"],
      [Role.DOCTOR]: ["prescribe", "view_encounter", "edit_encounter"],
      [Role.NURSE]: ["edit_vitals"],
      [Role.RECEPTIONIST]: ["create_appointment", "check_in_patient"],
    };
    
    const rolePerms = permissions[this.role];
    return rolePerms?.includes("*") || rolePerms?.includes(permission);
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      user_name: this.userName,
      email: this.email,
      password_hash: this.passwordHash,
      role: this.role,
      is_active: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  toGraphQL() {
    return {
      id: String(this.id),
      userName: this.userName,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt?.toISOString?.(),
      updatedAt: this.updatedAt?.toISOString?.(),
    };
  }
}