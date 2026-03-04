import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CompaniesService } from '../../../services/companies.service';
import { SolicitudEmpresa } from '../../../interfaces/company';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, SelectModule, MessageModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  styles: [`
    :host ::ng-deep .p-inputtext, 
    :host ::ng-deep .p-select {
        background-color: #27272a !important; /* zinc-800 */
        border: 1px solid #3f3f46 !important; /* zinc-600 */
        color: white !important;
        border-radius: 0.75rem !important;
    }
    :host ::ng-deep .p-select-label {
        color: white !important;
    }
    :host ::ng-deep .p-select-overlay {
        background-color: #27272a !important;
        border: 1px solid #3f3f46 !important;
    }
    :host ::ng-deep .p-select-option {
        color: white !important;
    }
    :host ::ng-deep .p-select-option.p-highlight {
        background-color: #3f3f46 !important;
    }
  `]
})
export class CompanyRegister implements OnInit {
  private companiesService = inject(CompaniesService);
  private router = inject(Router);

  loading = false;
  successMessage = '';
  errorMessage = '';

  registerForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { 
      nonNullable: true, 
      validators: [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ] 
    }),
    first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    last_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    ruc: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^([0-9]{10}|[0-9]{13})$')] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contacto_representante: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit() {
    this.registerForm.get('email')?.valueChanges.subscribe(value => {
      this.registerForm.patchValue({ username: value }, { emitEvent: false });
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const val = this.registerForm.getRawValue();
      const formData: SolicitudEmpresa = {
        ...val,
        nombre_representante: `${val.first_name} ${val.last_name}`,
        tipo_empresa: 'marca'
      };

      this.companiesService.registrarSolicitudEmpresa(formData).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Solicitud de registro enviada exitosamente para su revisión.';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error del backend:', err);
          
          let msg = 'Ocurrió un error al enviar la solicitud.';

          if (err.error && typeof err.error === 'object') {
            // Caso específico para error de email que mencionaste
            if (err.error.email) {
              const emailErr = Array.isArray(err.error.email) ? err.error.email[0] : err.error.email;
              msg = `Email: ${emailErr}`;
            } else {
              // Otros errores de campo
              const firstError = Object.entries(err.error)[0];
              if (firstError) {
                const [field, detail] = firstError;
                msg = `${field}: ${Array.isArray(detail) ? detail[0] : detail}`;
              }
            }
          } else if (typeof err.error === 'string') {
            msg = err.error;
          }

          this.errorMessage = msg;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
