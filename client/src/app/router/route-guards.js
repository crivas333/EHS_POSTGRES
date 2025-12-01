//src/app/router/route-guards.js
import { useAuthStore } from '@app/store/auth-store';

// Example role-based guards
export const useRouteGuard = () => {
  const { user } = useAuthStore();

  const canAccess = (requiredPermissions = []) => {
    if (!requiredPermissions.length) return true;
    
    return requiredPermissions.some(permission => 
      user?.permissions?.includes(permission)
    );
  };

  const hasRole = (requiredRoles = []) => {
    if (!requiredRoles.length) return true;
    
    return requiredRoles.includes(user?.role);
  };

  return { canAccess, hasRole };
};

// Route-specific permissions
export const ROUTE_PERMISSIONS = {
  '/configuracion': ['admin', 'system_config'],
  '/reportes': ['admin', 'reports_view'],
  '/pacientes': ['admin', 'receptionist', 'doctor'],
};