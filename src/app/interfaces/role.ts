export interface PermissionAction {
  id: number;
  codename: string;
}

export interface ModulePermissions {
  ver?: PermissionAction;
  crear?: PermissionAction;
  actualizar?: PermissionAction;
  eliminar?: PermissionAction;
}

export interface PermissionsResponse {
  [moduleName: string]: ModulePermissions;
}

export interface Role {
  id: number
  nombre: string;
  descripcion: string;
  permisos_ids: string[];
}
