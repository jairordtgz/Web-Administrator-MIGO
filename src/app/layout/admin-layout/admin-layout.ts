import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html'
})
export class AdminLayout implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  menuItems: any[] = [];
  userName = 'Usuario';
  userRole = '';

  ngOnInit() {
    this.loadUserData();
    this.updateNavigation();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateNavigation();
    });
  }

  loadUserData() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.first_name.toUpperCase();
      this.userRole = user.tipo_usuario.charAt(0).toUpperCase() + user.tipo_usuario.slice(1);
    }
  }

  updateNavigation() {
    this.loadUserData();
    const url = this.router.url;

    if (url.includes('/company')) {
      this.setCompanyMenu();
    } else if (url.includes('/super-admin')) {
      this.setSuperAdminMenu();
    } else if (url.includes('/publicist')) {
      this.setPublicistMenu();
    }
  }

  setSuperAdminMenu() {
    this.menuItems = [
      { label: 'Conductores', icon: 'pi pi-car', route: '/super-admin/conductores' },
      { label: 'Empresas/ Publicistas', icon: 'pi pi-building', route: '/super-admin/empresas' },
      { label: 'Campañas', icon: 'pi pi-megaphone', route: '/super-admin/campanias', badge: 7 },
      { label: 'Solicitudes Pendientes', icon: 'pi pi-file', route: '/super-admin/solicitudes', badge: 4 },
      { label: 'Verificaciones Pendientes', icon: 'pi pi-pencil', route: '/super-admin/verificaciones' },
      { label: 'Notificaciones', icon: 'pi pi-bell', route: '/super-admin/notificaciones' },
      { label: 'Permisos', icon: 'pi pi-check-circle', route: '/super-admin/roles' },
      { label: 'Panel de control', icon: 'pi pi-desktop', route: '/super-admin/dashboard' },
      { label: 'Configuración', icon: 'pi pi-cog', route: '/super-admin/configuracion' }
    ];
  }

  setCompanyMenu() {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-desktop', route: '/company/dashboard' },
      { label: 'Mis Campañas', icon: 'pi pi-megaphone', route: '/company/mis-campanias' },
      { label: 'Conductores', icon: 'pi pi-users', route: '/company/conductores' },
      { label: 'Reportes', icon: 'pi pi-chart-bar', route: '/company/reportes' },
      { label: 'Notificaciones', icon: 'pi pi-bell', route: '/company/notificaciones', badge: 3 },
    ];
  }

  setPublicistMenu() {
    this.menuItems = [
      { label: 'Empresas', icon: 'pi pi-building', route: '/publicist/empresas' },
    ];
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
