import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { CompaniesService } from '../../../../services/companies.service';
import { RegisterCompanyDTO } from '../../../../interfaces/company';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, SelectModule, ToastModule, MessageModule],
  providers: [MessageService],
  templateUrl: './register-company.html',
  styles: [`
    :host ::ng-deep .p-inputtext:not(.p-password-input), 
    :host ::ng-deep .p-select {
        border-radius: 9999px !important;
        background-color: #f3f4f6 !important;
        border: none !important;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        padding-left: 1rem;
    }
  `]
})
export class RegisterCompany implements OnInit {

  private fb = inject(FormBuilder);

  empresaForm!: FormGroup;

  tiposEmpresa = [{ label: 'Marca', value: 'marca' }, { label: 'Publicista', value: 'publicista' }];

  constructor(private companiesService: CompaniesService, private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    this.empresaForm = this.fb.group({
      ruc: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      representante_nombre: ['', Validators.required],
      representante_apellido: ['', Validators.required],
      tipo: [{ label: 'Marca', value: 'marca' }]
    });
  }

  generarClaveFuerte() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let claveGenerada = '';
    for (let i = 0; i < 12; i++) { claveGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length)); }

    this.empresaForm.patchValue({
      password: claveGenerada,
      confirmPassword: claveGenerada
    });

    this.messageService.add({ severity: 'info', summary: 'Clave Generada', detail: 'Se ha creado una combinación segura.' });
  }

  cancelar() {
    this.router.navigate(['/super-admin/empresas']);
  }

  guardar() {
    if (this.empresaForm.invalid) {
      if (this.empresaForm.get('ruc')?.hasError('pattern')) {
        this.messageService.add({ severity: 'warn', summary: 'RUC Inválido', detail: 'El RUC debe tener exactamente 13 números.' });
        return;
      }
      this.messageService.add({ severity: 'warn', summary: 'Faltan Datos o Inválidos', detail: 'Completa todos los campos correctamente.' });
      return;
    }

    const formValues = this.empresaForm.value;

    if (formValues.password !== formValues.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
      return;
    }

    const payload: RegisterCompanyDTO = {
      username: formValues.email,
      password: formValues.password,
      email: formValues.email,
      first_name: formValues.representante_nombre,
      last_name: formValues.representante_apellido,
      nombre: formValues.nombre,
      ruc: formValues.ruc,
      direccion: formValues.direccion,
      nombre_representante: `${formValues.representante_nombre} ${formValues.representante_apellido}`,
      contacto_representante: formValues.telefono,
      habilitada: true
    };

    // Llamada REAL al backend
    this.companiesService.registrarEmpresa(payload).subscribe({
      next: (respuesta) => {
        this.messageService.add({ severity: 'success', summary: '¡Registrado!', detail: 'Empresa guardada en la base de datos.' });
        setTimeout(() => {
          this.router.navigate(['/super-admin/empresas']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error del backend:', error);
        this.messageService.add({ severity: 'error', summary: 'Error de Servidor', detail: 'Verifica que el RUC o Correo no estén ya registrados.' });
      }
    });
  }
}