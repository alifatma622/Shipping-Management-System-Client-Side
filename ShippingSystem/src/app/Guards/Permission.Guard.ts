import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const PermissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload: any = jwtDecode(token);
    const permissionsJson = payload['permissions'];

    if (!permissionsJson) {
      router.navigate(['/unauthorized']);
      return false;
    }

    const permissions = JSON.parse(permissionsJson);
    const department = route.data?.['department'];
    const action = route.data?.['action'];

    const hasPermission = permissions[department]?.includes(action);

    if (!hasPermission) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Token decode error:", e);
    router.navigate(['/unauthorized']);
    return false;
  }
};
