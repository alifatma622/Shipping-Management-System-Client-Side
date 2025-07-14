import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);

    const roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const permissionsRaw = decoded['permissions'];


    const permissions = permissionsRaw ? JSON.parse(permissionsRaw) : {};

    const expectedRoles = route.data?.['roles'] as string[];
    const requiredDepartment = route.data?.['Department'];
    const requiredAction = route.data?.['Action'];

    // 🔐 تحقق من الدور
    const hasRole = Array.isArray(roles)
      ? roles.some(r => expectedRoles.includes(r))
      : expectedRoles.includes(roles);

    if (!hasRole) {
      router.navigate(['/unauthorized']);
      return false;
    }

    // ✅ إذا لم يُطلب تحقق صلاحيات إضافية، نسمح بالدخول
    if (!requiredDepartment || !requiredAction) return true;

    const userActions = permissions[requiredDepartment] || [];

    const hasPermission = Array.isArray(requiredAction)
      ? requiredAction.some(action => userActions.includes(action))
      : userActions.includes(requiredAction);

    if (!hasPermission) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  } catch (err) {
    router.navigate(['/login']);
    return false;
  }
};
