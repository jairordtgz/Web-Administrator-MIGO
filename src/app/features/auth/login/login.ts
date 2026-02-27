import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    ButtonModule, 
    InputTextModule, 
    PasswordModule, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private messageService = inject(MessageService);

  email = '';
  password = '';
  loading = false;

  onLogin() {
    if (!this.email || !this.password) {
      this.messageService.add({ severity: 'warn', summary: 'Campos vacíos', detail: 'Por favor, ingrese sus credenciales.' });
      return;
    }

    this.loading = true;

    // Simulación de login exitoso
    setTimeout(() => {
      this.loading = false;
      
      // Guardamos un nombre de empresa ficticio para el dashboard
      // En una app real esto vendría del backend tras validar el token
      localStorage.setItem('company_name', 'Migo Tech Solutions');
      
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Iniciando sesión...' });
      
      setTimeout(() => {
        this.router.navigate(['/company/dashboard']);
      }, 1000);
    }, 1500);
  }
}
