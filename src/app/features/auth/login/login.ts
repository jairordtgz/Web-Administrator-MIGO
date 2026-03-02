import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    IconField,
    InputIcon
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  loading = false;

  onLogin() {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor, complete correctamente todos los campos.'
      });
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ username: email!, password: password! }).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Iniciando sesión...' });

        const role = response.usuario.tipo_usuario;
        let targetRoute = '/company/dashboard';

        if (role === 'administrador') {
          targetRoute = '/super-admin/dashboard';
        } else if (role === 'publicista') {
          targetRoute = '/publicist/empresas';
        }

        this.router.navigate([targetRoute]);
        
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.error || 'Error al iniciar sesión. Verifique sus credenciales.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg
        });
      }
    });
  }
}
