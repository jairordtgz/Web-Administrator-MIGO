import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { CompaniesService } from '../../../services/companies.service';
import { SolicitudEmpresa } from '../../../interfaces/company';

@Component({
  selector: 'app-solicitudes-pendientes',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TagModule, ToastModule, IconFieldModule, InputIconModule],
  providers: [MessageService],
  templateUrl: './solicitudes-pendientes.html',
  styles: [`
    :host ::ng-deep .p-datatable-header {
      background: white;
      padding: 1.5rem;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
  `]
})
export class SolicitudesPendientes implements OnInit {
  private companiesService = inject(CompaniesService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  solicitudes: SolicitudEmpresa[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;
  filtroEstado: string = 'todas';
  filtroBusqueda: string = '';

  ngOnInit() {
    this.loadSolicitudes();
  }

  onLazyLoad(event?: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadSolicitudes(event);
  }

  onSearch(event: Event) {
    this.filtroBusqueda = (event.target as HTMLInputElement).value;
    this.first = 0; // Reiniciar a la primera página al buscar
    this.loadSolicitudes();
  }

  loadSolicitudes(event?: any) {
    this.loading = true;

    const page = event ? Math.floor(this.first / this.rows) + 1 : 1;
    const rows = event ? event.rows : this.rows;
    const searchValue = this.filtroBusqueda || '';
    const estado = this.filtroEstado === 'todas' ? '' : this.filtroEstado;

    this.companiesService.getSolicitudesEmpresa(page, rows, searchValue, estado).subscribe({
      next: (res) => {
        this.solicitudes = res.results;
        this.totalRecords = res.count;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las solicitudes.' });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByStatus(estado: string, table: any) {
    this.filtroEstado = estado;
    if (estado === 'todas') {
      table.filter('', 'estado', 'equals');
    } else {
      table.filter(estado, 'estado', 'equals');
    }
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  aprobar(solicitud: SolicitudEmpresa) {
    if (!solicitud.id) return;
    this.companiesService.aprobarSolicitud(solicitud.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Aprobada', detail: `Empresa ${solicitud.nombre} aprobada correctamente.` });
        this.loadSolicitudes();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo aprobar la solicitud.' });
      }
    });
  }

  rechazar(solicitud: SolicitudEmpresa) {
    if (!solicitud.id) return;
    this.companiesService.rechazarSolicitud(solicitud.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'warn', summary: 'Rechazada', detail: `La solicitud de ${solicitud.nombre} ha sido rechazada.` });
        this.loadSolicitudes();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo rechazar la solicitud.' });
      }
    });
  }

  getSeverity(estado: string | undefined) {
    switch (estado) {
      case 'pendiente': return 'warn';
      case 'aprobada': return 'success';
      case 'rechazada': return 'danger';
      default: return 'info';
    }
  }
}
