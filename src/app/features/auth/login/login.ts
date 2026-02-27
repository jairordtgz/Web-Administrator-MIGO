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

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
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

    // Simulación de login exitoso
    setTimeout(() => {
      this.loading = false;
      
      localStorage.setItem('company_name', 'Migo Tech Solutions');
      
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Iniciando sesión...' });
      
      setTimeout(() => {
        this.router.navigate(['/company/dashboard']);
      }, 1000);
    }, 1500);
  }
}
