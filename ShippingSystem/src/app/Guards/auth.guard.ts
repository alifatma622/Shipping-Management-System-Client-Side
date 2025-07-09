import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }



  try {
    const decoded: any = jwtDecode(token);
    const roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    const expectedRoles = route.data?.['roles'] as string[];

    const hasRole = Array.isArray(roles)
      ? roles.some((r) => expectedRoles.includes(r))
      : expectedRoles.includes(roles);

    if (!hasRole) {
      router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }

  catch (err) {
    router.navigate(['/login']);
    return false;
  }

}
