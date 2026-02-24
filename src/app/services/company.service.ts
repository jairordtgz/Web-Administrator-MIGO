import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Empresa } from '../interfaces/empresa';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }
  // TODO cambiar any a DTOs cuando sean definidos
  registerCompany(companyData: any): Observable<any> {
    console.log('Sending registration data to backend:', companyData);
    // Simulating backend response
    return of({ success: true, message: 'Registro exitoso (Simulado)' });
  }
}
