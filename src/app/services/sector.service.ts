import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  private sectoresTemporales: any[] = [];

  agregarSector(sector: any) {
    this.sectoresTemporales.push(sector);
  }

  obtenerSectores(): any[] {
    return this.sectoresTemporales;
  }

  limpiarSectores() {
    this.sectoresTemporales = [];
  }
}