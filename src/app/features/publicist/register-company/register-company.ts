import { Component, inject } from '@angular/core';
import { CompanyForm } from '../../../shared/forms/company-form/company-form';
import { Router } from '@angular/router';
import { RegisterCompanyDTO } from '../../../interfaces/company';
import { PublicistService } from '../../../services/publicist.service';

@Component({
  selector: 'app-register-company-publicist',
  standalone: true,
  imports: [CompanyForm],
  template: `
     <app-company-form
        (submitForm)="registrar($event)"
        (cancel)="cancelar()"
     />
  `
})
export class RegisterCompanyPublicist {

  private service = inject(PublicistService);
  private router = inject(Router);


  registrar(data: RegisterCompanyDTO) {
     this.service.crearEmpresaPublicista(data)
       .subscribe(() => {
          this.router.navigate(['/publicist/empresas'])
       });
  }

  cancelar() {
     this.router.navigate(['/publicist/empresas']);
  }
}