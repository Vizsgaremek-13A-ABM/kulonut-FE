import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent) },
    { path: 'user_register', loadComponent: () => import('./components/register-component/register-component').then(m => m.RegisterComponent) },
    { path: 'forgot_password', loadComponent: () => import('./components/forgot-password-page/forgot-password-page').then(m => m.ForgotPasswordPage) },
    { path: 'reset-password', loadComponent: () => import('./components/reset-password-page/reset-password-page').then(m => m.ResetPasswordPage) },
    { path: 'email-verified', loadComponent: () => import('./components/email-verified-page/email-verified-page').then(m => m.EmailVerifiedPage) },
    { path: 'main', canActivate: [authGuard], loadComponent: () => import('./components/main-page-component/main-page-component').then(m => m.MainPageComponent) },
    { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./components/profile-page-component/profile-page-component').then(m => m.ProfilePageComponent) },
    
    { path: 'project/edit/:id', canActivate: [roleGuard], loadComponent: () => import('./components/one-project-page/one-project-page').then(m => m.OneProjectPageComponent), data: { mode: 'edit', minRole: 50 } },
    { path: 'project/new', canActivate: [roleGuard], loadComponent: () => import('./components/one-project-page/one-project-page').then(m => m.OneProjectPageComponent), data: { mode: 'new', minRole: 50 } },
    { path: 'project/show/:id', canActivate: [authGuard], loadComponent: () => import('./components/one-project-page/one-project-page').then(m => m.OneProjectPageComponent), data: { mode: 'show' } },
    
    { path: 'projects', canActivate: [authGuard], loadComponent: () => import('./components/all-projects-page/all-projects-page').then(m => m.AllProjectsPage) },
    
    { path: 'admin', canActivate: [roleGuard], data: { minRole: 99 }, loadComponent: () => import('./components/admin-user-management-page/admin-user-management-page').then(m => m.AdminUserManagementPage) },
    { path: '**', redirectTo: '' }
];
