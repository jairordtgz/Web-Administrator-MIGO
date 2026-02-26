import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class CompanyRegister {
  private companyService = inject(CompanyService);
  private router = inject(Router);

  loading = false;
  successMessage = '';
  errorMessage = '';

  registerForm = new FormGroup({
    ruc: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^[0-9]+$')] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    representante_first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    representante_last_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    representante_contacto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const val = this.registerForm.value;

      const formData = {
        username: val.email,
        password: Math.random().toString(36).slice(-8), 
        email: val.email,
        first_name: val.representante_first_name,
        last_name: val.representante_last_name,
        nombre: val.nombre, 
        ruc: val.ruc,
        direccion: val.direccion,
        nombre_representante: `${val.representante_first_name} ${val.representante_last_name}`,
        contacto_representante: val.representante_contacto,
        habilitada: false
      };

      this.companyService.registerCompany(formData).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Información enviada exitosamente para su validación.';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Ocurrió un error al registrar la empresa.';
          console.error(err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
