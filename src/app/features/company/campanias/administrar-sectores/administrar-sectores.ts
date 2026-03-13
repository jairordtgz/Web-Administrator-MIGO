import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { GoogleMapsService } from '../../../../services/googlemaps.service';
import { SectorService } from '../../../../services/sector.service';

declare var google: any;

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
        position: relative;
        overflow: hidden;
    }
  `]
})
export class AdministrarSectores implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private googleMapsService = inject(GoogleMapsService);
  private sectorService = inject(SectorService);

  sectorForm: FormGroup;
  displayDrawingGuide: boolean = false;
  
  map: any;
  drawingManager: any;
  currentPolygon: any = null;

  constructor() {
    this.sectorForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      coordenadas_cerco: [null, [Validators.required]]
    });
  }

  ngOnInit() {}

  async ngAfterViewInit() {
    await this.googleMapsService.load();
    
    const mapOptions = {
      center: { lat: -2.1894, lng: -79.8891 }, 
      zoom: 12,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      zoomControl: true,
    };
    
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.setupDrawingManager();
  }

  setupDrawingManager() {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null, 
      drawingControl: false, 
      polygonOptions: {
        editable: true,
        draggable: true,
        fillColor: '#3B82F6',
        fillOpacity: 0.4,
        strokeColor: '#2563EB',
        strokeWeight: 2
      }
    });
    this.drawingManager.setMap(this.map);

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        
        this.drawingManager.setDrawingMode(null);

        if (this.currentPolygon) {
          this.currentPolygon.setMap(null);
        }
        
        this.currentPolygon = event.overlay;
        this.updateCoordinates();

        const path = this.currentPolygon.getPath();
        google.maps.event.addListener(path, 'set_at', () => this.updateCoordinates());
        google.maps.event.addListener(path, 'insert_at', () => this.updateCoordinates());
        google.maps.event.addListener(path, 'remove_at', () => this.updateCoordinates());
      }
    });
  }

  startDrawing() {
    this.displayDrawingGuide = true;
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  }

  clearMap() {
    if (this.currentPolygon) {
      this.currentPolygon.setMap(null);
      this.currentPolygon = null;
    }
    this.sectorForm.patchValue({ coordenadas_cerco: null });
  }

  updateCoordinates() {
    if (!this.currentPolygon) return;
    
    const vertices = this.currentPolygon.getPath();
    const coordenadas = [];
    
    for (let i = 0; i < vertices.getLength(); i++) {
      const xy = vertices.getAt(i);
      coordenadas.push({ lat: xy.lat(), lng: xy.lng() });
    }

    this.sectorForm.patchValue({ coordenadas_cerco: coordenadas });
  }

  saveSector() {
    if (this.sectorForm.invalid || !this.sectorForm.value.coordenadas_cerco) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Completa los campos y dibuja un polígono en el mapa.' });
      return;
    }
    
    const nuevoSector = {
      nombre: this.sectorForm.value.nombre,
      coordenadas_cerco: this.sectorForm.value.coordenadas_cerco
    };

    this.sectorService.agregarSector(nuevoSector);
    
    console.log("Sector guardado temporalmente:", nuevoSector);
    this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Sector agregado correctamente a la campaña.' });
    
    setTimeout(() => {
      this.router.navigate(['/company/mis-campanias/crear']);
    }, 1500);
  }

  goBack() {
    this.router.navigate(['/company/mis-campanias/crear']);
  }
}
