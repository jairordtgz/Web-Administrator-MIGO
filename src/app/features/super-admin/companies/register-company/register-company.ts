import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CompaniesService } from '../../../../services/companies.service';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule, SelectModule, ToastModule],
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
export class RegisterCompany {

  tiposEmpresa = [{ label: 'Marca', value: 'MARCA' }, { label: 'Publicista', value: 'PUBLICISTA' }];
  nuevaEmpresa = { ruc: '', nombre: '', direccion: '', email: '', password: '', confirmPassword: '', telefono: '', representante: '' };

  constructor(private companiesService: CompaniesService, private router: Router, private messageService: MessageService) { }

  generarClaveFuerte() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let claveGenerada = '';
    for (let i = 0; i < 12; i++) { claveGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length)); }
    this.nuevaEmpresa.password = claveGenerada;
    this.nuevaEmpresa.confirmPassword = claveGenerada;
    this.messageService.add({ severity: 'info', summary: 'Clave Generada', detail: 'Se ha creado una combinación segura.' });
  }

  cancelar() {
    this.router.navigate(['/super-admin/empresas']);
  }

  /*guardar() {
    if (!this.nuevaEmpresa.ruc || !this.nuevaEmpresa.nombre || !this.nuevaEmpresa.email || !this.nuevaEmpresa.password) {
      this.messageService.add({ severity: 'warn', summary: 'Faltan Datos', detail: 'Completa los campos obligatorios.' });
      return;
    }
    if (this.nuevaEmpresa.password !== this.nuevaEmpresa.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
      return;
    }

    const nueva = {
      nombres: this.nuevaEmpresa.nombre,
      ruc: '#' + this.nuevaEmpresa.ruc,
      fecha: new Date().toLocaleDateString('es-ES'),
      correo: this.nuevaEmpresa.email,
      tipo: this.nuevaEmpresa.tipo ? (this.nuevaEmpresa.tipo as any).label.toLowerCase() : 'marca',
      estado: 'activo'
    };

    this.companiesService.agregarEmpresa(nueva);

    // Como ahora son páginas separadas, aquí en el futuro se conectara el Backend
    this.messageService.add({ severity: 'success', summary: '¡Registrado!', detail: 'Empresa creada con éxito.' });

    setTimeout(() => {
      this.router.navigate(['/super-admin/empresas']);
    }, 1500);
  }*/

  guardar() {
    // Validamos que la dirección también esté llena
    if (!this.nuevaEmpresa.ruc || !this.nuevaEmpresa.nombre || !this.nuevaEmpresa.email || !this.nuevaEmpresa.password || !this.nuevaEmpresa.direccion) {
      this.messageService.add({ severity: 'warn', summary: 'Faltan Datos', detail: 'Completa todos los campos.' });
      return;
    }
    if (this.nuevaEmpresa.password !== this.nuevaEmpresa.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
      return;
    }

    // Llamada REAL al backend
    this.companiesService.registrarEmpresa(this.nuevaEmpresa).subscribe({
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