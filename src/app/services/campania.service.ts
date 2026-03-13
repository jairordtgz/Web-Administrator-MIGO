import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CampaniaList, CatalogoVehiculo, CatalogoVehiculoResponse, TipoBrandeo } from '../interfaces/campanas';
import { PaginatedResponse } from '../interfaces/pagination';
import { EMPTY, Observable, expand, map, reduce } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CampaniaService {

  http: HttpClient = inject(HttpClient);

  brandeoUrl = 'http://localhost:8000/api/admin/catalogo/brandeos/';
  vehiculoUrl = 'http://localhost:8000/api/admin/catalogo/vehiculos/';

  getCatalogo(): Observable<CatalogoVehiculo[]> {
    return this.http.get<CatalogoVehiculoResponse>(this.vehiculoUrl + '?page_size=50').pipe(
      expand((response) =>
        response.next ? this.http.get<CatalogoVehiculoResponse>(response.next + (response.next.includes('?') ? '&' : '?') + 'page_size=50') : EMPTY
      ),
      map((response) => response.results),
      reduce((catalogo, results) => [...catalogo, ...results], [] as CatalogoVehiculo[])
    );
  }

  getBrandeo(): Observable<TipoBrandeo[]> {
    return this.http.get<PaginatedResponse<TipoBrandeo>>(this.brandeoUrl + '?page_size=50').pipe(
      expand((response) =>
        response.next ? this.http.get<PaginatedResponse<TipoBrandeo>>(response.next + (response.next.includes('?') ? '&' : '?') + 'page_size=50') : EMPTY
      ),
      map((response) => response.results),
      reduce((brandeos, results) => [...brandeos, ...results], [] as TipoBrandeo[])
    );
  }

  getVehiculo() {
    return this.http.get(this.vehiculoUrl);
  }

  createCampania(campania: any): Observable<any> {
    const url = 'http://localhost:8000/api/admin/campania/crear-campania/';
    return this.http.post(url, campania);
  }

  getMisCampanias(): Observable<CampaniaList[]> {
    const url = 'http://localhost:8000/api/admin/campania/mis-campanias/';
    return this.http.get<CampaniaList[]>(url);
  }


}
