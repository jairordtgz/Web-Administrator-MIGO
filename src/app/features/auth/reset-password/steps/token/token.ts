import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-token-step',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    ButtonModule, 
    InputOtpModule, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './token.html',
  styleUrl: './token.css'
})
export class TokenStep implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  tokenForm = this.fb.group({
    token: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
  });

  email: string = '';
  loading: boolean = false;

  ngOnInit() {
    this.email = this.authService.getResetEmail();
    if (!this.email) {
      this.router.navigate(['/reset-password/email']);
    }
  }

  onSubmit() {
    if (this.tokenForm.invalid) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Token incompleto', 
        detail: 'Por favor, ingrese el código de 4 dígitos.' 
      });
      return;
    }

    this.loading = true;
    const { token } = this.tokenForm.getRawValue();

    this.authService.verifyToken(token!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/reset-password/new-password']);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Código incorrecto.' });
      }
    });
  }

  resend() {
    this.authService.sendResetEmail(this.email).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Enviado', detail: 'Código reenviado.' });
    });
  }
}
