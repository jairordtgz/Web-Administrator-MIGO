import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-email-step',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    ButtonModule, 
    InputTextModule, 
    IconField, 
    InputIcon, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './email.html',
  styleUrl: './email.css'
})
export class EmailStep {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  loading: boolean = false;

  onSubmit() {
    if (this.emailForm.invalid) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Campo requerido', 
        detail: 'Por favor, ingrese un correo electrónico válido.' 
      });
      return;
    }

    this.loading = true;
    const { email } = this.emailForm.getRawValue();

    this.authService.sendResetEmail(email!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/reset-password/token']);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el correo.' });
      }
    });
  }
}
