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
import { Router } from '@angular/router';
import { CompaniesService } from '../../../services/companies.service';

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
    :host ::ng-deep .p-dialog .p-inputtext:not(.p-password-input), 
    :host ::ng-deep .p-dialog .p-select {
        border-radius: 9999px !important;
        background-color: #f3f4f6 !important;
        border: none !important;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        padding-left: 1rem;
    }
    :host ::ng-deep .p-dialog .p-dialog-header {
        background-color: transparent;
        padding-bottom: 0;
    }
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
  fechaFiltro: Date | undefined;
  tipoActual: string = 'Todos los Filtros';

  constructor(private messageService: MessageService, private companiesService: CompaniesService, private router: Router) { }

  ngOnInit() {
    this.empresasMock = this.companiesService.getEmpresas();
  }

  irARegistro() {
    this.router.navigate(['/super-admin/empresas/registrar']);
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