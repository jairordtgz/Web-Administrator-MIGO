import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPassword)
    },

    {
        path: 'super-admin',
        component: AdminLayout,
        // canActivate: [RoleGuard], <-- Listo para cuando configuren seguridad
        children: [
            { path: 'dashboard', loadComponent: () => import('./features/super-admin/dashboard/dashboard').then(m => m.Dashboard) },
            { path: 'configuracion', loadComponent: () => import('./features/super-admin/configuracion/configuracion').then(m => m.Configuracion) },
            { path: 'campanias', loadComponent: () => import('./features/super-admin/campanias/campanias').then(m => m.Campanias) },
            { path: 'usuarios', loadComponent: () => import('./features/super-admin/users-management/users-management').then(m => m.UsersManagement) },
            { path: 'empresas', loadComponent: () => import('./features/super-admin/companies/companies').then(m => m.Companies) },
            { path: 'conductores', loadComponent: () => import('./features/super-admin/monitor/monitor').then(m => m.Monitor) },
            { path: 'notificaciones', loadComponent: () => import('./features/super-admin/notifications/notifications').then(m => m.Notifications) },
            { path: 'publicidad', loadComponent: () => import('./features/super-admin/publicidad/publicidad').then(m => m.Publicidad) },
            { path: 'brandeo', loadComponent: () => import('./features/super-admin/brandeo/brandeo').then(m => m.Brandeo) },
            { path: 'solicitudes', loadComponent: () => import('./features/super-admin/solicitudes-pendientes/solicitudes-pendientes').then(m => m.SolicitudesPendientes) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    {
        path: 'company',
        component: AdminLayout,
        children: [
            { path: 'dashboard', loadComponent: () => import('./features/company/company-dashboard/company-dashboard').then(m => m.CompanyDashboard) },
            { path: 'mis-campanias', loadComponent: () => import('./features/company/campanias/campanias').then(m => m.Campanias) },
            { path: 'conductores', loadComponent: () => import('./features/company/administrar-conduc/administrar-conduc').then(m => m.AdministrarConduc) },
            { path: 'reportes', loadComponent: () => import('./features/company/reports/reports').then(m => m.Reports) },
            { path: 'notificaciones', loadComponent: () => import('./features/company/notifications/notifications').then(m => m.Notifications) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    {
        path: 'publicist',
        component: AdminLayout,
        children: [
            { path: 'empresas', loadComponent: () => import('./features/publicist/list-companies/list-companies').then(m => m.ListCompanies) },
            { path: '', redirectTo: 'empresas', pathMatch: 'full' }
        ]
    },

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];