import { Injectable } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { environment } from '../../../envioronments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private loaded: boolean = false;

  async load(): Promise<void> {
    if (!this.loaded) {
      
      setOptions({
        key: environment.googleMapsApiKey,
        v: 'weekly'
      });

      await importLibrary('maps');
      await importLibrary('drawing');
      
      this.loaded = true;
    }
  }
}