import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Interfaz temporal (luego se moverá a src/app/interfaces/)
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
  templateUrl: './roles-management.html',
  styleUrls: ['./roles-management.css']
})
export class RolesManagement implements OnInit {

  roles: any[] = [];
  selectedRole: any;
  permissions: ModulePermission[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.roles = [
      { name: 'Super Administrador', code: 'ADMIN' },
      { name: 'Empresa', code: 'COMPANY' },
      { name: 'Publicista', code: 'PUBLICIST' }
    ];

    this.selectedRole = this.roles[0];

    this.loadMockPermissions();
  }

  onRoleChange(event: any) {
    this.loadMockPermissions();
    this.messageService.add({ severity: 'info', summary: 'Rol Cambiado', detail: `Cargando permisos para ${event.value.name}` });
  }

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

  // Acción de guardar solo envía al backend
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