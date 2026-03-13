import { Component, OnInit, ViewChild, ChangeDetectorRef, inject, AfterViewInit, AfterContentChecked, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PublicistService } from '../../../services/publicist.service';
import { PublicistCompany } from '../../../interfaces/publicista';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-companies',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule,
    FormsModule, 
    TableModule, 
    InputTextModule, 
    TagModule, 
    SkeletonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './list-companies.html',
  styleUrl: './list-companies.css',
})
export class ListCompanies  {
  @ViewChild('dt') dt!: Table;
  private publicistService = inject(PublicistService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  

  empresas = signal<PublicistCompany[]>([]);
  loading = signal(true);  
  rows: number = 10;

  ngOnInit() {
    this.loadCompanies();
  }

  irARegistro(){  
    this.router.navigate(['/publicist/empresas/registrar']);
  }

  loadCompanies() {
    this.publicistService.getMisEmpresas().subscribe({
      next: (data) => {
        this.empresas.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Error al cargar empresas:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudieron cargar sus empresas.' 
        });
      }
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }
}
