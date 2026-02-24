import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html'
})
export class AdminLayout implements OnInit {
  menuItems: any[] = [];

  ngOnInit() {
    this.menuItems = [
      { label: 'Conductores', icon: 'pi pi-user', route: '/super-admin/conductores' },
      { label: 'Empresas/ Publicistas', icon: 'pi pi-building', route: '/super-admin/empresas' },
      { label: 'Campañas', icon: 'pi pi-megaphone', route: '/super-admin/campanias', badge: 7 },
      { label: 'Solicitudes Pendientes', icon: 'pi pi-file', route: '/super-admin/solicitudes', badge: 4 },
      { label: 'Verificaciones Pendientes', icon: 'pi pi-pencil', route: '/super-admin/verificaciones' },
      { label: 'Notificaciones', icon: 'pi pi-bell', route: '/super-admin/notificaciones' },
      { label: 'Permisos', icon: 'pi pi-check-circle', route: '/super-admin/usuarios' },
      { label: 'Panel de control', icon: 'pi pi-desktop', route: '/super-admin/dashboard' },
      { label: 'Configuración', icon: 'pi pi-cog', route: '/super-admin/configuracion' }
    ];
  }
}