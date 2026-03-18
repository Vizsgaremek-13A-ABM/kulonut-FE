import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent) },
    // stay signed in
    { path: 'user_register', loadComponent: () => import('./components/register-component/register-component').then(m => m.RegisterComponent) },
    //auth guard majd innentol
    { path: 'main', loadComponent: () => import('./components/main-page-component/main-page-component').then(m => m.MainPageComponent) },
    { path: 'profile', loadComponent: () => import('./components/profile-page-component/profile-page-component').then(m => m.ProfilePageComponent) },
    //idaig mindre
    { path: '**', redirectTo: '' }
];
