import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-new-password-step',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    ButtonModule, 
    PasswordModule, 
    IconField, 
    InputIcon, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './new-password.html',
  styleUrl: './new-password.css'
})
export class NewPasswordStep implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  passwordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  loading = false;

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { passwordMismatch: true } : null;
  }

  ngOnInit() {
    if (!this.authService.getResetEmail()) {
      this.router.navigate(['/reset-password/email']);
    }
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Formulario inválido', 
        detail: 'Por favor, revise los campos.' 
      });
      return;
    }

    this.loading = true;
    const { password } = this.passwordForm.getRawValue();

    this.authService.updatePassword(password!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/reset-password/success']);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña.' });
      }
    });
  }
}
