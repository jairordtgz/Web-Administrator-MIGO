import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { CampaniaService } from '../../../services/campania.service';
import { CampaniaList } from '../../../interfaces/campanas';

@Component({
  selector: 'app-campanias',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, TagModule, DialogModule, DividerModule, TooltipModule, RouterModule],
  templateUrl: './campanias.html',
  styleUrl: './campanias.css',
})
export class Campanias implements OnInit {
  private campaniaService = inject(CampaniaService);
  
  campanias: CampaniaList[] = [];
  loading: boolean = true;
  selectedCampania: CampaniaList | null = null;
  displayDetail: boolean = false;

  ngOnInit() {
    this.loadCampanias();
  }

  loadCampanias() {
    this.loading = true;
    this.campaniaService.getMisCampanias().subscribe({
      next: (data) => {
        console.log(JSON.stringify(data)) ;
        this.campanias = data;
        this.loading = false;
        console.log(this.campanias);
      },
      error: (err) => {
        console.error('Error cargando campañas:', err);
        this.loading = false;
      }
    });
  }

  verDetalle(campania: CampaniaList) {
    this.selectedCampania = campania;
    this.displayDetail = true;
  }

  getStatusSeverity(status: string | undefined) {
    if (!status) return 'info';
    const s = status.toLowerCase();
    switch (s) {
      case 'activa': return 'success';
      case 'pasada': 
      case 'terminada':
      case 'finalizada': return 'danger';
      case 'pendiente':
      case 'programada': return 'warn';
      default: return 'info';
    }
  }
}
