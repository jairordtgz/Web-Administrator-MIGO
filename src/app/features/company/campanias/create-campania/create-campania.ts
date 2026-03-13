import { Component, OnInit, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { CampaniaCreacion, CatalogoVehiculo, Tarifa, TarifaCreacion, HorarioCreacion, SectorCreacion } from '../../../../interfaces/campanas';
import { SectorService } from '../../../../services/sector.service';
import { GoogleMapsService } from '../../../../services/googlemaps.service';
import { CampaniaService } from '../../../../services/campania.service';

declare var google: any;

export const campaignDatesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const inicio = control.get('fecha_inicio')?.value;
  const fin = control.get('fecha_fin')?.value;
  const registro = control.get('fecha_limite_registro')?.value;

  const errors: any = {};

  if (inicio && fin && new Date(inicio) > new Date(fin)) {
    errors.dateRangeInvalid = true;
  }

  if (registro && fin && new Date(registro) > new Date(fin)) {
    errors.registrationAfterEnd = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const duplicateTariffValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formArray = control as FormArray;
  const values = formArray.value as any[];
  const seen = new Set<string>();

  for (const v of values) {
    const key = `${v.sector_id}-${v.horario_index}-${v.categoria_vehiculo}-${v.tipo_brandeo}`;
    if (seen.has(key)) {
      return { duplicateTariff: true };
    }
    seen.add(key);
  }
  return null;
};

export const duplicateSectorValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formArray = control as FormArray;
  const ids = formArray.controls
    .map(c => c.get('id')?.value)
    .filter(id => id !== null);

  const hasDuplicate = ids.some((id, index) => ids.indexOf(id) !== index);
  return hasDuplicate ? { duplicateSector: true } : null;
};

@Component({
  selector: 'app-create-campania',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    InputNumberModule, SelectModule, CheckboxModule, DatePickerModule,
    TextareaModule, ToastModule, CardModule, DividerModule, ToggleButtonModule,
    DialogModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './create-campania.html',
  styleUrl: './create-campania.css'
})
export class CreateCampania implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private campaniaService = inject(CampaniaService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private sectorService = inject(SectorService);
  private googleMapsService = inject(GoogleMapsService);



  @ViewChild('previewMapContainer', { static: false }) previewMapContainer!: ElementRef;
  previewMap: any;
  previewPolygon: any;

  campaniaForm!: FormGroup;

  ciclosPago = [
    { label: 'Semanal', value: 'semanal' },
    { label: 'Quincenal', value: 'quincenal' },
    { label: 'Mensual', value: 'mensual' }
  ];

  diasSemana = [
    { label: 'Lunes', value: 'Lunes' },
    { label: 'Martes', value: 'Martes' },
    { label: 'Miércoles', value: 'Miércoles' },
    { label: 'Jueves', value: 'Jueves' },
    { label: 'Viernes', value: 'Viernes' },
    { label: 'Sábado', value: 'Sábado' },
    { label: 'Domingo', value: 'Domingo' }
  ];

  brandingPartsCatalog: any[] = [];

  categoriasVehiculo = [
    { label: 'Sedán', value: 'sedan' },
    { label: 'SUV', value: 'suv' },
    { label: 'Camioneta', value: 'camioneta' },
    { label: 'Camión', value: 'camion' },
    { label: 'Moto', value: 'moto' }
  ];

  sectoresDisponibles: any[] = [];

  mockMarcas = [];
  mockModelos = [];

  fullVehiclesCatalog: any[] = [];

  sectoresOptions: any[] = [];
  displaySectorPreview: boolean = false;
  selectedSectorForPreview: any = null;

  ngOnInit() {
    const sectoresNuevos = this.sectorService.obtenerSectores();
    if (sectoresNuevos && sectoresNuevos.length > 0) {
      sectoresNuevos.forEach((nuevoSector, index) => {
        this.sectoresDisponibles.push({
          id: 'temp_' + index,
          nombre: nuevoSector.nombre,
          descripcion: 'Sector dibujado manualmente',
          coordenadas_cerco: nuevoSector.coordenadas_cerco
        });
      });
    }
    this.initBrandeoCatalog();
    this.initForm();
  }

  initBrandeoCatalog() {
    this.campaniaService.getBrandeo().subscribe({
      next: (brandeos) => {
        this.brandingPartsCatalog = brandeos.map(b => ({
          label: `${b.nombre} (${b.tipo_material})`,
          value: b.id_brandeo
        }));
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el catálogo de brandeos'
        });
      }
    });
  }

  initForm() {
    this.campaniaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      // TODO: estos campos no se reciben en el back
      responsable_nombre: ['', [Validators.maxLength(150)]],
      // TODO: estos campos no se reciben en el back
      responsable_email: ['', [Validators.email]],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
      fecha_limite_registro: [null],
      presupuesto_total: [null, [Validators.required, Validators.min(0.01)]],
      ciclo_pago: ['mensual', [Validators.required, Validators.maxLength(20)]],
      activa: [true],
      limite_vehiculos: [null],
      requisitos: [''],
      sectores: this.fb.array([], [duplicateSectorValidator]),
      horarios: this.fb.array([]),
      vehiculosAdmisibles: this.fb.array([]),
      tarifasConfig: this.fb.array([], [duplicateTariffValidator]), // Flat Rules System
      km_minimo_conductor: [null, [Validators.required, Validators.min(0)]],
    }, { validators: [campaignDatesValidator] });

    this.campaniaForm.get('presupuesto_total')?.valueChanges.subscribe(val => {
      this.campaniaForm.patchValue({ presupuesto_restante: val }, { emitEvent: false });
    });

    this.addSector();
    this.addHorario();
    console.log('Iniciando form')
    this.initVehiculosCatalog();
    this.addTarifaRule(); // Cargar la primera regla por defecto
  }

  get sectores() { return this.campaniaForm.get('sectores') as FormArray; }
  get horarios() { return this.campaniaForm.get('horarios') as FormArray; }
  get tarifasConfig() { return this.campaniaForm.get('tarifasConfig') as FormArray; }
  get vehiculosAdmisibles() { return this.campaniaForm.get('vehiculosAdmisibles') as FormArray; }

  initVehiculosCatalog() {
    this.campaniaService.getCatalogo().subscribe({
      next: (catalogo) => {
        console.log('Catálogo de vehículos recibido:', catalogo);
        if (catalogo.length > 0) {
          console.log('Muestra de un item del catálogo:', JSON.stringify(catalogo[0]));
        }
        this.fullVehiclesCatalog = catalogo;

        this.procesarVehiculosAdmisibles();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el catálogo de vehículos'
        });
      }
    });
  }

  procesarVehiculosAdmisibles() {
    // this.vehiculosAdmisibles.clear();

    const sortedCatalog = [...this.fullVehiclesCatalog].sort((a, b) => {
      const catCompare = a.categoria.localeCompare(b.categoria);
      if (catCompare !== 0) return catCompare;
      return a.marca.localeCompare(b.marca);
    });


    sortedCatalog.forEach((v: CatalogoVehiculo) => {
      const actualId = v.id_catalogo ?? v.id ?? v.id_vehiculo;
      this.vehiculosAdmisibles.push(
        this.fb.group({
          id: [actualId],
          categoria: [v.categoria],
          marca: [v.marca],
          modelo: [v.modelo],
          seleccionado: [false],
          anio_minimo: [2010, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
        })
      );
    });
    this.cdr.detectChanges();
  }


  shouldShowCategory(index: number): boolean {
    if (index === 0) return true;
    return this.vehiculosAdmisibles.at(index).get('categoria')?.value !==
      this.vehiculosAdmisibles.at(index - 1).get('categoria')?.value;
  }

  shouldShowMarca(index: number): boolean {
    if (index === 0) return true;
    const current = this.vehiculosAdmisibles.at(index).value;
    const previous = this.vehiculosAdmisibles.at(index - 1).value;
    return current.marca !== previous.marca || current.categoria !== previous.categoria;
  }

  toggleAllForMarca(index: number) {
    const target = this.vehiculosAdmisibles.at(index).value;
    const targetCat = target.categoria;
    const targetMarca = target.marca;

    const group = this.vehiculosAdmisibles.controls.filter(c => {
      const val = c.value;
      return val.categoria === targetCat && val.marca === targetMarca;
    });

    const allSelected = group.every(c => c.get('seleccionado')?.value);
    const newValue = !allSelected;

    group.forEach(c => c.get('seleccionado')?.setValue(newValue));
  }

  toggleAllForCategory(index: number) {
    const target = this.vehiculosAdmisibles.at(index).value;
    const targetCat = target.categoria;

    const group = this.vehiculosAdmisibles.controls.filter(c => {
      return c.value.categoria === targetCat;
    });

    const allSelected = group.every(c => c.get('seleccionado')?.value);
    const newValue = !allSelected;

    group.forEach(c => c.get('seleccionado')?.setValue(newValue));
  }



  updateSectoresOptions() {
    this.sectoresOptions = this.sectores.controls.map((s, i) => {
      const sectorId = s.get('id')?.value;
      const sectorMock = this.sectoresDisponibles.find(sd => sd.id === sectorId);
      return {
        label: sectorMock?.nombre || `Sector ${i + 1}`,
        value: sectorId
      };
    });
  }

  addSector() {
    this.sectores.push(this.fb.group({
      id: [null, Validators.required]
    }));
  }

  removeSector(index: number) { this.sectores.removeAt(index); }

  showSectorPreview(index: number) {
    const sectorId = this.sectores.at(index).get('id')?.value;
    if (sectorId) {
      this.selectedSectorForPreview = this.sectoresDisponibles.find(sd => sd.id === sectorId);
      this.displaySectorPreview = true;
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un sector para previsualizar.' });
    }
  }

  async initPreviewMap() {
    await this.googleMapsService.load();

    if (!this.previewMapContainer) return;

    const mapOptions = {
      center: { lat: -2.1894, lng: -79.8891 },
      zoom: 12,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      zoomControl: true,
    };

    this.previewMap = new google.maps.Map(this.previewMapContainer.nativeElement, mapOptions);
    const coords = this.selectedSectorForPreview?.coordenadas_cerco;

    if (coords && coords.length > 0) {
      this.previewPolygon = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#EAB308',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FACC15',
        fillOpacity: 0.35,
      });

      this.previewPolygon.setMap(this.previewMap);
      const bounds = new google.maps.LatLngBounds();
      coords.forEach((coord: any) => bounds.extend(coord));
      this.previewMap.fitBounds(bounds);
    }
  }

  goToCreateSectors() {
    this.messageService.add({ severity: 'info', summary: 'Navegación', detail: 'Redirigiendo a creación de sectores...' });
    setTimeout(() => {
      this.router.navigate(['/company/administrar-sectores']);
    }, 1000);
  }

  addHorario() { this.horarios.push(this.fb.group({ dia: ['Lunes', Validators.required], hora_inicio: [null, Validators.required], hora_fin: [null, Validators.required] })); }
  removeHorario(index: number) { this.horarios.removeAt(index); }

  duplicateLastHorario() {
    const length = this.horarios.length;
    if (length > 0) {
      const last = this.horarios.at(length - 1).getRawValue();
      this.horarios.push(this.fb.group({
        dia: [last.dia, Validators.required],
        hora_inicio: [last.hora_inicio, Validators.required],
        hora_fin: [last.hora_fin, Validators.required]
      }));
    } else {
      this.addHorario();
    }
  }

  addTarifaRule() {
    this.tarifasConfig.push(this.fb.group({
      sector_id: [null], // null = TODOS
      horario_index: [null], // null = TODOS
      categoria_vehiculo: ['sedan', Validators.required],
      tipo_brandeo: [1, Validators.required],
      valor: [0, [Validators.required, Validators.min(0.0001)]]
    }));
  }

  removeTarifaRule(index: number) {
    this.tarifasConfig.removeAt(index);
  }

  duplicateLastRule() {
    const length = this.tarifasConfig.length;
    if (length > 0) {
      const lastRule = this.tarifasConfig.at(length - 1).getRawValue();
      this.tarifasConfig.push(this.fb.group({
        sector_id: [lastRule.sector_id],
        horario_index: [lastRule.horario_index],
        categoria_vehiculo: [lastRule.categoria_vehiculo, Validators.required],
        tipo_brandeo: [lastRule.tipo_brandeo, Validators.required],
        valor: [lastRule.valor, [Validators.required, Validators.min(0.0001)]]
      }));
    } else {
      this.addTarifaRule();
    }
  }

  getSectoresOptionsWithAll() {
    const options = this.sectores.controls.map((s, i) => {
      const sectorId = s.get('id')?.value;
      const sector = this.sectoresDisponibles.find(sd => sd.id === sectorId);
      return { label: sector?.nombre || `Sector ${i + 1}`, value: sectorId };
    }).filter(opt => opt.value !== null);

    return [{ label: '🌎 TODOS LOS SECTORES', value: null }, ...options];
  }

  getHorariosOptionsWithAll() {
    const options = this.horarios.controls.map((h, i) => {
      const dia = h.get('dia')?.value;
      const inicio = h.get('hora_inicio')?.value;
      const fin = h.get('hora_fin')?.value;
      return { label: `${dia} (${inicio}h - ${fin}h)`, value: i };
    });

    return [{ label: '⏰ TODOS LOS HORARIOS', value: null }, ...options];
  }

  getSectoresOnly() {
    return this.sectores.controls.map((s, i) => {
      const sectorId = s.get('id')?.value;
      const sector = this.sectoresDisponibles.find(sd => sd.id === sectorId);
      return { label: sector?.nombre || `Sector ${i + 1}`, value: sectorId };
    }).filter(opt => opt.value !== null);
  }

  getHorariosOnly() {
    return this.horarios.controls.map((h, i) => {
      const dia = h.get('dia')?.value;
      const inicio = h.get('hora_inicio')?.value;
      const fin = h.get('hora_fin')?.value;
      return { label: `${dia} (${inicio}h - ${fin}h)`, value: i };
    });
  }

  getEffectiveRate(sectorId: any, horarioIdx: number | null, categoria: string): number {
    let total = 0;
    const rules = this.tarifasConfig.getRawValue() as any[];

    this.brandingPartsCatalog.forEach(part => {
      const bestRule = rules
        .filter(r =>
          r.tipo_brandeo === part.value &&
          r.categoria_vehiculo === categoria &&
          (r.sector_id === null || r.sector_id === sectorId) &&
          (r.horario_index === null || r.horario_index === horarioIdx)
        )
        .sort((a, b) => {
          const scoreA = (a.sector_id !== null ? 2 : 0) + (a.horario_index !== null ? 1 : 0);
          const scoreB = (b.sector_id !== null ? 2 : 0) + (b.horario_index !== null ? 1 : 0);
          return scoreB - scoreA;
        })[0];

      if (bestRule) total += bestRule.valor;
    });
    return total;
  }

  onSubmit() {
    if (this.campaniaForm.invalid) {
      console.warn('Formulario inválido. Detalles de errores:');
      Object.keys(this.campaniaForm.controls).forEach(key => {
        const control = this.campaniaForm.get(key);
        if (control?.invalid) {
          console.log(`Campo [${key}] - Status: ${control.status} - Errores:`, control.errors);
          if (control instanceof FormArray) {
            control.controls.forEach((group, index) => {
              if (group.invalid) {
                console.log(`  -> Item [${index}] en FormArray [${key}] - Errores:`, group.errors);
                if (group instanceof FormGroup) {
                  Object.keys(group.controls).forEach(subKey => {
                    const subControl = group.get(subKey);
                    if (subControl?.invalid) {
                      console.log(`     -> Subcampo [${subKey}] - Errores:`, subControl.errors);
                    }
                  });
                }
              }
            });
          }
        }
      });

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos requeridos.' });
      this.campaniaForm.markAllAsTouched();
      return;
    }

    const formValues = this.campaniaForm.getRawValue();

    const payloadSectores = formValues.sectores.map((s: any) => {
      const sectorEncontrado = this.sectoresDisponibles.find(sd => sd.id === s.id);
      return {
        nombre: sectorEncontrado?.nombre || 'Sector sin nombre',
        coordenadas_cerco: sectorEncontrado?.coordenadas_cerco || []
      };
    });

    const payloadHorarios = formValues.horarios.map((h: any) => ({
      dia_semana: h.dia,
      hora_inicio: this.formatTime(h.hora_inicio ?? 0),
      hora_fin: this.formatTime(h.hora_fin ?? 23)
    }));

    const flattenedTarifas: TarifaCreacion[] = [];
    formValues.tarifasConfig.forEach((rule: any) => {
      const sectorIndices: number[] = [];
      if (rule.sector_id === null) {
        payloadSectores.forEach((_: any, i: number) => sectorIndices.push(i));
      } else {
        const idx = formValues.sectores.findIndex((s: any) => s.id === rule.sector_id);
        if (idx !== -1) sectorIndices.push(idx);
      }

      const horarioIndices: number[] = [];
      if (rule.horario_index === null) {
        payloadHorarios.forEach((_: any, i: number) => horarioIndices.push(i));
      } else {
        horarioIndices.push(rule.horario_index);
      }

      sectorIndices.forEach(sIdx => {
        horarioIndices.forEach(hIdx => {
          flattenedTarifas.push({
            tipo_brandeo_id: rule.tipo_brandeo,
            categoria_vehiculo: rule.categoria_vehiculo,
            valor: rule.valor,
            sector_index: sIdx,
            horario_index: hIdx
          });
        });
      });
    });

    const rawVehiculos = formValues.vehiculosAdmisibles;
    const reglasVehiculos = rawVehiculos
      .filter((v: any) => v.seleccionado)
      .map((v: any) => ({
        marca: v.marca,
        categoria: v.categoria,
        anio_minimo: v.anio_minimo
      }));

    const payload: CampaniaCreacion = {
      nombre: formValues.nombre,
      fecha_inicio: this.formatDate(formValues.fecha_inicio),
      fecha_fin: this.formatDate(formValues.fecha_fin),
      fecha_limite_registro: formValues.fecha_limite_registro ? this.formatDate(formValues.fecha_limite_registro) : null,
      presupuesto_total: formValues.presupuesto_total,
      km_minimo_conductor: formValues.km_minimo_conductor,
      limite_vehiculos_permitidos: formValues.limite_vehiculos || null,
      limite_vehiculos_automatico: false, // Por ahora el flujo es manual
      ciclo_pago: formValues.ciclo_pago,
      requisitos: formValues.requisitos || '',
      sectores: payloadSectores,
      horarios: payloadHorarios,
      tarifas: flattenedTarifas,
      reglas_vehiculos: reglasVehiculos
    };

    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas publicar esta campaña? Los conductores empezarán a verla en breve.',
      header: 'Confirmar Publicación',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'CANCELAR',
      acceptLabel: 'SÍ, PUBLICAR',
      acceptButtonStyleClass: 'p-button-warning !rounded-full',
      rejectButtonStyleClass: 'p-button-text !text-gray-500',
      accept: () => {
        console.log('Payload Final:', JSON.parse(JSON.stringify(payload)));
        this.campaniaService.createCampania(payload).subscribe({
          next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Publicado', detail: 'Campaña creada con éxito.' });
            console.log('Respuesta del servidor:', res);
            // setTimeout(() => this.router.navigate(['/company/mis-campanias']), 1500);
          },
          error: (err) => {
            console.error('Error al crear campaña:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.detail || 'No se pudo crear la campaña en el servidor.'
            });
          }
        });
      }
    });
  }

  private formatDate(date: any): string {
    return date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : '';
  }

  private formatTime(hour: number): string {
    const d = new Date();
    d.setHours(hour, 0, 0, 0);
    return formatDate(d, 'HH:mm', 'en-US');
  }

  cancelar() { this.router.navigate(['/company/mis-campanias']); }
}
