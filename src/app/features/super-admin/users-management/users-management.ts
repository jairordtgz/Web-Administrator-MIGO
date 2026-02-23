import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para los checkboxes (ngModel)

// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Interfaz temporal (luego se moverá a src/app/models/)
interface ModulePermission {
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './users-management.html',
  styleUrls: ['./users-management.css']
})
export class UsersManagement implements OnInit {

  roles: any[] = [];
  selectedRole: any;
  permissions: ModulePermission[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    // 1. Cargamos los roles falsos para el Dropdown
    this.roles = [
      { name: 'Super Administrador', code: 'ADMIN' },
      { name: 'Empresa', code: 'COMPANY' },
      { name: 'Publicista', code: 'PUBLICIST' }
    ];

    this.selectedRole = this.roles[0]; // Seleccionamos Admin por defecto

    // 2. Cargamos los módulos exactos que pide HUSA1
    this.loadMockPermissions();
  }

  // Cuando se cambia el rol en el dropdown, idealmente pediríamos los permisos al backend
  onRoleChange(event: any) {
    this.loadMockPermissions();
    this.messageService.add({ severity: 'info', summary: 'Rol Cambiado', detail: `Cargando permisos para ${event.value.name}` });
  }

  // Los 6 módulos obligatorios de HUSA1
  loadMockPermissions() {
    this.permissions = [
      { moduleName: 'Usuarios', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { moduleName: 'Empresas', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { moduleName: 'Notificaciones', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { moduleName: 'Publicidad', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { moduleName: 'Talleres de Brandeo', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { moduleName: 'Solicitudes de Brandeo', canView: true, canCreate: true, canEdit: true, canDelete: true }
    ];
  }

  // Acción de guardar que NO calcula nada, solo envía al backend
  savePermissions() {
    const payload = {
      role: this.selectedRole.code,
      permissions: this.permissions
    };

    console.log('JSON listo para enviar a Django:', payload);

    // Aquí irá: this.adminService.updatePermissions(payload).subscribe(...)
    this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: 'Permisos actualizados en el servidor' });
  }
}