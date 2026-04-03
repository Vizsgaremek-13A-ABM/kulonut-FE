import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import AuthService from '../services/auth.service';

export const authGuard: CanActivateFn = (_, state) => {
    const authService = inject(AuthService);
    const router = inject(Router)
    if (authService.GetUser()) {
        return true;
    }
    return router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });
};