import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { PopoverModule } from 'primeng/popover';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, DialogModule, ButtonModule,
    InputTextModule, PasswordModule, SelectModule, ToastModule, ToolbarModule,
    TagModule, DatePickerModule, PopoverModule
  ],
  providers: [MessageService],
  templateUrl: './companies.html',
  styles: [`
    /* Estilos para forzar inputs redondeados y grises dentro del modal */
    :host ::ng-deep .p-dialog .p-inputtext:not(.p-password-input), 
    :host ::ng-deep .p-dialog .p-select {
        border-radius: 9999px !important;
        background-color: #f3f4f6 !important; /* gray-100 */
        border: none !important;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        padding-left: 1rem; /* Un poco más de padding a la izquierda */
    }
    /* Quitamos el fondo de la cabecera por defecto para usar el nuestro */
    :host ::ng-deep .p-dialog .p-dialog-header {
        background-color: transparent;
        padding-bottom: 0;
    }
    /* Limpiamos la cabecera de la tabla */
    :host ::ng-deep .p-datatable .p-datatable-header {
        background-color: transparent;
        border: none;
        padding: 0.5rem 0;
    }
    :host ::ng-deep .p-datepicker { border: none; box-shadow: none; }
  `]
})
export class Companies implements OnInit {
  @ViewChild('dt') dt!: Table;

  empresasMock: any[] = [];
  mostrarModalRegistro: boolean = false;
  fechaFiltro: Date | undefined;
  tipoActual: string = 'Todos los Filtros';

  tiposEmpresa = [
    { label: 'Marca', value: 'MARCA' },
    { label: 'Publicista', value: 'PUBLICISTA' }
  ];

  nuevaEmpresa = {
    ruc: '', nombre: '', tipo: null, email: '',
    password: '', confirmPassword: '', telefono: '', representante: ''
  };

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.empresasMock = [
      { nombres: 'Roberto Ruiz', ruc: '#0985428795', fecha: '23/10/2023', correo: 'dirección@correo.com', tipo: 'marca', estado: 'activo' },
      { nombres: 'Agencia Creativa', ruc: '#0991234567001', fecha: '25/10/2023', correo: 'contacto@agencia.com', tipo: 'publicista', estado: 'inactivo' },
      { nombres: 'Tech Solutions', ruc: '#0987654321001', fecha: '26/10/2023', correo: 'info@tech.ec', tipo: 'marca', estado: 'activo' },
      { nombres: 'Publicidad Global', ruc: '#1712345678001', fecha: '27/10/2023', correo: 'ejecutivo@global.com', tipo: 'publicista', estado: 'activo' }
    ];
  }

  abrirModalRegistro() {
    this.nuevaEmpresa = { ruc: '', nombre: '', tipo: null, email: '', password: '', confirmPassword: '', telefono: '', representante: '' };
    this.mostrarModalRegistro = true;
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
  }

  generarClaveFuerte() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let claveGenerada = '';
    for (let i = 0; i < 12; i++) {
      claveGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    this.nuevaEmpresa.password = claveGenerada;
    this.nuevaEmpresa.confirmPassword = claveGenerada;
    this.messageService.add({ severity: 'info', summary: 'Clave Generada', detail: 'Se ha creado una combinación segura.' });
  }

  registrarEmpresa() {
    if (!this.nuevaEmpresa.ruc || !this.nuevaEmpresa.nombre || !this.nuevaEmpresa.email || !this.nuevaEmpresa.password) {
      this.messageService.add({ severity: 'warn', summary: 'Faltan Datos', detail: 'Completa los campos obligatorios.' });
      return;
    }
    if (this.nuevaEmpresa.password !== this.nuevaEmpresa.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
      return;
    }

    this.empresasMock = [
      {
        nombres: this.nuevaEmpresa.nombre,
        ruc: '#' + this.nuevaEmpresa.ruc,
        fecha: new Date().toLocaleDateString('es-ES'),
        correo: this.nuevaEmpresa.email,
        tipo: this.nuevaEmpresa.tipo ? (this.nuevaEmpresa.tipo as any).label.toLowerCase() : 'marca',
        estado: 'activo'
      },
      ...this.empresasMock
    ];

    this.messageService.add({ severity: 'success', summary: '¡Registrado!', detail: 'La empresa ha sido creada correctamente.' });
    this.cerrarModalRegistro();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }

  filtrarPorTipo(tipo: string, opFiltro: any, nombreFiltro: string) {
    this.tipoActual = nombreFiltro;
    if (this.dt) {
      this.dt.filter(tipo, 'tipo', 'contains');
    }
    opFiltro.hide();
  }

  aplicarFiltroFecha(op: any) {
    if (this.fechaFiltro && this.dt) {
      const dia = this.fechaFiltro.getDate().toString().padStart(2, '0');
      const mes = (this.fechaFiltro.getMonth() + 1).toString().padStart(2, '0');
      const anio = this.fechaFiltro.getFullYear();
      const fechaTexto = `${dia}/${mes}/${anio}`;

      this.dt.filter(fechaTexto, 'fecha', 'contains');
      op.hide();
    } else {
      this.limpiarFecha(op);
    }
  }

  limpiarFecha(op: any) {
    this.fechaFiltro = undefined;
    if (this.dt) {
      this.dt.filter('', 'fecha', 'contains');
    }
    op.hide();
    this.messageService.add({ severity: 'info', summary: 'Filtro', detail: 'Filtro de fecha limpiado' });
  }

  exportExcel() {
    const datosLimpios = this.empresasMock.map(emp => ({
      'Nombres': emp.nombres,
      'RUC': emp.ruc,
      'Fecha de Ingreso': emp.fecha,
      'Correo': emp.correo,
      'Tipo': emp.tipo.toUpperCase()
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosLimpios);
    const workbook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
    XLSX.writeFile(workbook, 'Empresas_Registradas.xlsx');

    this.messageService.add({ severity: 'success', summary: 'Excel Generado', detail: 'El archivo se ha descargado.' });
  }

  exportPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const columnas = [
      { header: 'Nombres', dataKey: 'nombres' },
      { header: 'RUC', dataKey: 'ruc' },
      { header: 'Fecha de Ingreso', dataKey: 'fecha' },
      { header: 'Correo', dataKey: 'correo' },
      { header: 'Tipo', dataKey: 'tipo' }
    ];

    const filas = this.empresasMock.map(emp => ({
      nombres: emp.nombres, ruc: emp.ruc, fecha: emp.fecha,
      correo: emp.correo, tipo: emp.tipo.toUpperCase()
    }));

    autoTable(doc, {
      columns: columnas,
      body: filas,
      startY: 20,
      headStyles: { fillColor: [43, 43, 43] },
      styles: { fontSize: 10, cellPadding: 3 }
    });

    doc.save('Empresas_Registradas.pdf');
    this.messageService.add({ severity: 'success', summary: 'PDF Generado', detail: 'El archivo se ha descargado.' });
  }
}