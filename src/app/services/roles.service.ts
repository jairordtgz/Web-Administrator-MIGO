import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionsResponse, Role } from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api/admin/usuario/';

  getPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(`${this.baseUrl}permiso/`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}rol/`);
  }

  updateRole(roleId: number, data: { permisos: number[] }): Observable<any> {
    return this.http.put<Role>(`${this.baseUrl}rol/${roleId}/`, data);
  }

  createRole(data: { nombre: string; descripcion: string; permisos: number[] }): Observable<any> {
    return this.http.post<Role>(`${this.baseUrl}rol/`, data);
  }
}
