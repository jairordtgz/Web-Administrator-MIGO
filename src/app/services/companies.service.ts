import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { RegisterCompanyDTO, Company, CompanyResponse, SolicitudEmpresa } from '../interfaces/company';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/usuario/empresa/';
  private solicitudUrl = 'http://127.0.0.1:8000/api/admin/solicitud/empresas/';

  constructor(private http: HttpClient) { }

  registrarEmpresa(payload: RegisterCompanyDTO): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  registrarSolicitudEmpresa(payload: SolicitudEmpresa): Observable<any> {
    return this.http.post(this.solicitudUrl, payload);
  }

  getSolicitudesEmpresa(search?: string): Observable<SolicitudEmpresa[]> {
    let url = this.solicitudUrl;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    return this.http.get<SolicitudEmpresa[]>(url);
  }

  aprobarSolicitud(id: number): Observable<any> {
    return this.http.post(`${this.solicitudUrl}${id}/aprobar/`, {});
  }

  rechazarSolicitud(id: number): Observable<any> {
    return this.http.post(`${this.solicitudUrl}${id}/rechazar/`, {});
  }

  getEmpresas(page: number = 1, pageSize: number = 10, search?: string, ordering?: string): Observable<{ total: number, results: any[] }> {
    let url = `${this.apiUrl}?page=${page}&page_size=${pageSize}`;
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (ordering) {
      url += `&ordering=${ordering}`;
    }

    return this.http.get<CompanyResponse>(url).pipe(
      map((respuestaBackend: CompanyResponse) => {
        return {
          total: respuestaBackend.count,
          results: respuestaBackend.results.map((empresa: Company) => ({
            nombres: empresa.nombre,
            ruc: empresa.ruc,
            fecha: empresa.fecha_creacion ? new Date(empresa.fecha_creacion).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES'),
            correo: empresa.email || empresa.username,
            tipo: empresa.tipo_empresa || 'marca',
            estado: empresa.habilitada ? 'activo' : 'inactivo'
          }))
        };
      })
    );
  }
}
