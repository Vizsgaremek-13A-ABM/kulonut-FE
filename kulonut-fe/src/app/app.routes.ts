import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent) },
    // stay signed in
    { path: 'user_register', loadComponent: () => import('./components/register-component/register-component').then(m => m.RegisterComponent) },
    //auth guard majd innentol
    { path: 'main', canActivate: [authGuard], loadComponent: () => import('./components/main-page-component/main-page-component').then(m => m.MainPageComponent) },
    { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./components/profile-page-component/profile-page-component').then(m => m.ProfilePageComponent) },
    { path: 'project/edit/:id', canActivate: [authGuard], loadComponent: () => import('./components/one-project-page/one-project-page').then(m => m.OneProjectPageComponent), data: { mode: 'edit' } },
    { path: 'project/new', canActivate: [authGuard], loadComponent: () => import('./components/one-project-page/one-project-page').then(m => m.OneProjectPageComponent), data: { mode: 'new' } },
    { path: 'project/show/:id', canActivate: [authGuard], loadComponent: () => import('./components/one-project-page/one-project-page').then(m => m.OneProjectPageComponent), data: { mode: 'show' } },
    //idaig mindre
    { path: '**', redirectTo: '' }
];
