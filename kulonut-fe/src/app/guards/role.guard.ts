import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import AuthService from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router)
    const minimumRole = route.data['minRole'] as number;
    //email cim elfogadast is majd nezni
    if (authService.GetUser() && authService.GetUser()!.role.level >= minimumRole) {
        return true;
    }
    return router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });
};