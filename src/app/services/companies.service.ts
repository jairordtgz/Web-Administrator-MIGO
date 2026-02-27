import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { RegisterCompanyDTO } from '../interfaces/company';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/usuario/empresas/';

  private empresas = [
    { nombres: 'Roberto Ruiz', ruc: '#0985428795', fecha: '23/10/2023', correo: 'dirección@correo.com', tipo: 'marca', estado: 'activo' },
    { nombres: 'Agencia Creativa', ruc: '#0991234567001', fecha: '25/10/2023', correo: 'contacto@agencia.com', tipo: 'publicista', estado: 'inactivo' },
    { nombres: 'Tech Solutions', ruc: '#0987654321001', fecha: '26/10/2023', correo: 'info@tech.ec', tipo: 'marca', estado: 'activo' },
    { nombres: 'Publicidad Global', ruc: '#1712345678001', fecha: '27/10/2023', correo: 'ejecutivo@global.com', tipo: 'publicista', estado: 'activo' }
  ];

  constructor(private http: HttpClient) { }

  getEmpresas() {
    return this.empresas;
  }

  agregarEmpresa(nueva: any) {
    this.empresas = [nueva, ...this.empresas];
  }

  registrarEmpresa(payload: RegisterCompanyDTO): Observable<any> {
    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => {
        const nuevaVisual = {
          nombres: payload.nombre,
          ruc: payload.ruc,
          fecha: new Date().toLocaleDateString('es-ES'),
          correo: payload.email,
          tipo: 'marca', 
          estado: 'activo'
        };
        this.empresas = [nuevaVisual, ...this.empresas];
      })
    );
  }

  getEmpresasBackend(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((respuestaBackend: any) => {
        return respuestaBackend.map((empresa: any) => ({
          nombres: empresa.nombre,
          ruc: empresa.ruc,
          // TODO estas fechas se estan generando aqui, implementar endpoint que las traiga de verdad
          fecha: new Date().toLocaleDateString('es-ES'), 
          correo: empresa.email,
          tipo: empresa.tipo_empresa || 'marca',
          estado: empresa.habilitada ? 'activo' : 'inactivo'
        }));
      })
    );
  }
}