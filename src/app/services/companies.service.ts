import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private empresas = [
    { nombres: 'Roberto Ruiz', ruc: '#0985428795', fecha: '23/10/2023', correo: 'dirección@correo.com', tipo: 'marca', estado: 'activo' },
    { nombres: 'Agencia Creativa', ruc: '#0991234567001', fecha: '25/10/2023', correo: 'contacto@agencia.com', tipo: 'publicista', estado: 'inactivo' },
    { nombres: 'Tech Solutions', ruc: '#0987654321001', fecha: '26/10/2023', correo: 'info@tech.ec', tipo: 'marca', estado: 'activo' },
    { nombres: 'Publicidad Global', ruc: '#1712345678001', fecha: '27/10/2023', correo: 'ejecutivo@global.com', tipo: 'publicista', estado: 'activo' }
  ];

  getEmpresas() {
    return this.empresas;
  }

  agregarEmpresa(nueva: any) {
    this.empresas = [nueva, ...this.empresas];
  }
}