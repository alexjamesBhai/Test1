import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const managerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if ((user?.role === 'MANAGER' || user?.role === 'OWNER') && user?.organizationId) {
    return true;
  }

  router.navigate(['/access-denied']);
  return false;
};
