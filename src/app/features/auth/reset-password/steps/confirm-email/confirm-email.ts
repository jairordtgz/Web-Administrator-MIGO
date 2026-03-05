import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ButtonModule, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css'
})
export class ConfirmEmail implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  email: string = '';

  ngOnInit() {
    this.email = this.authService.getResetEmail();
    
    if (!this.email) {
      this.router.navigate(['/reset-password/email']);
    }
  }

  resend() {
    this.authService.sendResetEmail(this.email).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Enviado', 
          detail: 'El enlace de recuperación ha sido reenviado a tu correo.' 
        });
      },
      error: () => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Hubo un problema al reenviar el enlace. Intente más tarde.' 
        });
      }
    });
  }
}