import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Company, RegisterCompanyDTO } from '../interfaces/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }
  
  registerCompany(companyData: RegisterCompanyDTO): Observable<any> {
    console.log('Sending registration data to backend:', companyData);
    // Simulating backend response or real call if URL is defined
    // return this.http.post('YOUR_API_URL', companyData);
    return of({ success: true, message: 'Registro exitoso (Simulado)' });
  }
}
