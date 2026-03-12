import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent) },
    // stay signed in
    { path: 'user_register', loadComponent: () => import('./components/register-component/register-component').then(m => m.RegisterComponent) },
    { path: '**', redirectTo: '' }
];
