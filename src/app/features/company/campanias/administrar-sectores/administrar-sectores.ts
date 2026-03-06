import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-administrar-sectores',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, 
    TextareaModule, ToastModule, CardModule, DialogModule
  ],
  providers: [MessageService],
  templateUrl: './administrar-sectores.html',
  styles: [`
    .map-container {
        height: 500px;
        background-color: #f3f4f6;
        border-radius: 1.5rem;
        border: 2px dashed #d1d5db;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }
    .map-placeholder {
        text-align: center;
        z-index: 10;
    }
  `]
})
export class AdministrarSectores implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

  sectorForm: FormGroup;
  displayDrawingGuide: boolean = false;

  constructor() {
    this.sectorForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      poligono_wkt: [''] // Well-Known Text for polygons
    });
  }

  ngOnInit() {}

  saveSector() {
    if (this.sectorForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa los campos.' });
      return;
    }
    
    this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Sector creado correctamente (Simulado).' });
    setTimeout(() => {
      this.router.navigate(['/company/mis-campanias/crear']);
    }, 1500);
  }

  startDrawing() {
    this.messageService.add({ 
        severity: 'info', 
        summary: 'Google Maps API', 
        detail: 'Iniciando herramienta de dibujo de polígonos...' 
    });
    this.displayDrawingGuide = true;
  }

  goBack() {
    this.router.navigate(['/company/mis-campanias/crear']);
  }
}
