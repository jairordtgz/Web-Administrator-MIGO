import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

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

  registrarEmpresa(datosFormulario: any): Observable<any> {
    const payload = {
      username: datosFormulario.email, 
      password: datosFormulario.password,
      email: datosFormulario.email,
      first_name: datosFormulario.representante.split(' ')[0] || 'Representante',
      last_name: datosFormulario.representante.split(' ').slice(1).join(' ') || 'Empresa',
      nombre: datosFormulario.nombre,
      ruc: datosFormulario.ruc,
      direccion: datosFormulario.direccion,
      nombre_representante: datosFormulario.representante,
      contacto_representante: datosFormulario.telefono
    };

    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => {
        const nuevaVisual = {
          nombres: datosFormulario.nombre,
          ruc: datosFormulario.ruc,
          fecha: new Date().toLocaleDateString('es-ES'),
          correo: datosFormulario.email,
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
          fecha: new Date().toLocaleDateString('es-ES'),
          correo: empresa.email,
          tipo: 'marca',
          estado: 'activo'
        }));
      })
    );
  }
}