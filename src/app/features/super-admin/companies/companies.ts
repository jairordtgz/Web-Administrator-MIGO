import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
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
    TagModule, SkeletonModule
  ],
  providers: [MessageService],
  templateUrl: './companies.html',
  styleUrl: './companies.css'
})
export class Companies implements OnInit {
  @ViewChild('dt') dt!: Table;

  empresas: any[] = [];
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  loading: boolean = false;

  constructor(private messageService: MessageService, private companiesService: CompaniesService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // El onLazyLoad de la tabla cargará los datos al iniciar
  }

  loadCompanies(event?: any) {
    this.loading = true;
    
    const page = event ? Math.floor(event.first / event.rows) + 1 : 1;
    const rows = event ? event.rows : this.rows;

    const searchValue = event?.filters?.['global']?.value || '';

    let ordering = '';
    if (event?.sortField) {
      const fieldMap: { [key: string]: string } = {
        'fecha': 'usuario__fecha_creacion'
      };
      
      const backendField = fieldMap[event.sortField] || event.sortField;
      ordering = event.sortOrder === 1 ? backendField : `-${backendField}`;
    }

    this.empresas = Array.from({ length: rows }).map(() => ({}));

    this.companiesService.getEmpresas(page, rows, searchValue, ordering).subscribe({
      next: (response) => {
        this.empresas = response.results;
        this.totalRecords = response.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al cargar los datos:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar con la base de datos.' });
      }
    });
  }

  onLazyLoad(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadCompanies(event);
  }

  irARegistro() {
    this.router.navigate(['/super-admin/empresas/registrar']);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  exportExcel() {
    if (!this.empresas || this.empresas.length === 0) return;

    const datosLimpios = this.empresas.map(emp => ({
      'Nombres': emp.nombres || '',
      'RUC': emp.ruc || '',
      'Fecha de Ingreso': emp.fecha || '',
      'Correo': emp.correo || '',
      'Tipo': emp.tipo ? emp.tipo.toUpperCase() : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosLimpios);
    const workbook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
    XLSX.writeFile(workbook, 'Empresas_Registradas.xlsx');

    this.messageService.add({ severity: 'success', summary: 'Excel Generado', detail: 'El archivo se ha descargado.' });
  }

  exportPdf() {
    if (!this.empresas || this.empresas.length === 0) return;

    const doc = new jsPDF('l', 'mm', 'a4');
    const columnas = [
      { header: 'Nombres', dataKey: 'nombres' },
      { header: 'RUC', dataKey: 'ruc' },
      { header: 'Fecha de Ingreso', dataKey: 'fecha' },
      { header: 'Correo', dataKey: 'correo' },
      { header: 'Tipo', dataKey: 'tipo' }
    ];

    const filas = this.empresas.map(emp => ({
      nombres: emp.nombres || '', 
      ruc: emp.ruc || '', 
      fecha: emp.fecha || '',
      correo: emp.correo || '', 
      tipo: emp.tipo ? emp.tipo.toUpperCase() : ''
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
