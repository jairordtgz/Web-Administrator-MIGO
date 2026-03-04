import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RolesService } from '../../../services/roles.service';
import { Role, PermissionsResponse, ModulePermissions } from '../../../interfaces/role';
import { forkJoin } from 'rxjs';

interface ModulePermission {
  moduleName: string;
  view?: { id: number, codename: string, active: boolean };
  create?: { id: number, codename: string, active: boolean };
  edit?: { id: number, codename: string, active: boolean };
  delete?: { id: number, codename: string, active: boolean };
}

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './roles-management.html',
  styleUrls: ['./roles-management.css']
})
export class RolesManagement implements OnInit {
  private rolesService = inject(RolesService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  roles: Role[] = [];
  selectedRole: Role | null = null;
  permissionsMatrix: ModulePermission[] = [];
  rawPermissions: PermissionsResponse = {};

  roleDialog: boolean = false;
  roleForm: FormGroup;
  submitted: boolean = false;

  constructor() {
    this.roleForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(selectId?: number) {
    forkJoin({
      roles: this.rolesService.getRoles(),
      permissions: this.rolesService.getPermissions()
    }).subscribe({
      next: (res) => {
        this.roles = res.roles;
        this.rawPermissions = res.permissions;
        if (this.roles.length > 0) {
          const targetId = selectId || this.selectedRole?.id;
          this.selectedRole = this.roles.find(r => r.id === targetId) || this.roles[0];
          this.buildPermissionsMatrix();
        }
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles y permisos.' });
      }
    });
  }

  onRoleChange(event: any) {
    this.buildPermissionsMatrix();
  }

  buildPermissionsMatrix() {
    if (!this.selectedRole) return;

    const rolePerms = new Set(this.selectedRole.permisos_ids);
    this.permissionsMatrix = Object.keys(this.rawPermissions).map(moduleName => {
      const perms: ModulePermissions = this.rawPermissions[moduleName];
      return {
        moduleName: moduleName,
        view: perms.ver ? { id: perms.ver.id, codename: perms.ver.codename, active: rolePerms.has(perms.ver.codename) } : undefined,
        create: perms.crear ? { id: perms.crear.id, codename: perms.crear.codename, active: rolePerms.has(perms.crear.codename) } : undefined,
        edit: perms.actualizar ? { id: perms.actualizar.id, codename: perms.actualizar.codename, active: rolePerms.has(perms.actualizar.codename) } : undefined,
        delete: perms.eliminar ? { id: perms.eliminar.id, codename: perms.eliminar.codename, active: rolePerms.has(perms.eliminar.codename) } : undefined
      };
    });
  }

  openNew() {
    this.roleForm.reset();
    this.submitted = false;
    this.roleDialog = true;
  }

  hideDialog() {
    this.roleDialog = false;
    this.submitted = false;
  }

  saveRole() {
    this.submitted = true;

    if (this.roleForm.invalid) {
      return;
    }

    const newRoleData = {
      ...this.roleForm.value,
      permisos: [] 
    };

    this.rolesService.createRole(newRoleData).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: 'Rol creado correctamente' });
        this.loadData(res.id_rol);
        this.hideDialog();
      },
      error: (err) => {
        console.error('Error al crear rol:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el rol.' });
      }
    });
  }

  savePermissions() {
    if (!this.selectedRole) return;

    const updatedPerms: number[] = [];
    this.permissionsMatrix.forEach(row => {
      if (row.view?.active) updatedPerms.push(row.view.id);
      if (row.create?.active) updatedPerms.push(row.create.id);
      if (row.edit?.active) updatedPerms.push(row.edit.id);
      if (row.delete?.active) updatedPerms.push(row.delete.id);
    });

    this.rolesService.updateRole(this.selectedRole.id, { permisos: updatedPerms }).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: 'Permisos actualizados correctamente' });
        this.loadData(this.selectedRole?.id);
      },
      error: (err) => {
        console.error('Error al actualizar permisos:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el rol.' });
      }
    });
  }
}