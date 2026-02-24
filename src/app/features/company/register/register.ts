import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
    // descripcion: new FormControl('', { nonNullable: true }),
    representante_nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    representante_contacto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    // password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    // confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  }, { 
    // validators: [this.passwordMatchValidator] 
  });

  // passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  //   const password = control.get('password');
  //   const confirmPassword = control.get('confirmPassword');
  //   
  //   return password && confirmPassword && password.value === confirmPassword.value
  //     ? null : { mismatch: true };
  // }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.companyService.registerCompany(this.registerForm.getRawValue()).subscribe({
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
