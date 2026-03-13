import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicistCompany } from '../interfaces/publicista';

@Injectable({
  providedIn: 'root'
})
export class PublicistService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/admin/usuario/publicista/mis-empresas/';

  getMisEmpresas(): Observable<PublicistCompany[]> {
    return this.http.get<PublicistCompany[]>(this.apiUrl);
  }
  
  crearEmpresaPublicista(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/admin/usuario/publicista/crear-empresa', data);
  }

}
