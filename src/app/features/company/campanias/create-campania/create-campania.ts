import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { CampaniaCreacion, Tarifa } from '../../../../interfaces/campanas';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const inicio = control.get('fecha_inicio');
  const fin = control.get('fecha_fin');
  if (inicio && fin && inicio.value && fin.value && new Date(inicio.value) > new Date(fin.value)) {
    return { dateRangeInvalid: true };
  }
  return null;
};

@Component({
  selector: 'app-create-campania',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, 
    InputNumberModule, SelectModule, CheckboxModule, DatePickerModule, 
    TextareaModule, ToastModule, CardModule, DividerModule, ToggleButtonModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './create-campania.html',
  styleUrl: './create-campania.css'
})
export class CreateCampania implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

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

  brandingPartsCatalog = [
    { label: '1 Puerta', value: 1 },
    { label: '2 Puertas', value: 2 },
    { label: '3 o 4 Puertas (SUV/Sedan)', value: 3 },
    { label: 'Vidrio de Atrás', value: 5 },
    { label: '1 Lado Cajón (Camión)', value: 6 },
    { label: '2 Lados Cajón (Camión)', value: 7 },
    { label: 'LED encima Auto', value: 8 },
    { label: 'LED Vidrio Atrás', value: 9 },
    { label: 'Tiempo (Minutos)', value: 10 }
  ];

  categoriasVehiculo = [
    { label: 'Sedán', value: 'sedan' },
    { label: 'SUV', value: 'suv' },
    { label: 'Camioneta', value: 'camioneta' },
    { label: 'Camión', value: 'camion' },
    { label: 'Moto', value: 'moto' }
  ];

  mockSectores = [
    { id: 1, nombre: 'Centro Histórico', descripcion: 'Zona central con alta densidad.' },
    { id: 2, nombre: 'Zona Norte', descripcion: 'Área residencial y comercial.' },
    { id: 3, nombre: 'Sector Financiero', descripcion: 'Edificios de oficinas y bancos.' },
    { id: 4, nombre: 'Parques y Recreación', descripcion: 'Zonas verdes y de esparcimiento.' }
  ];

  sectoresOptions: any[] = [];
  displaySectorPreview: boolean = false;
  selectedSectorForPreview: any = null;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.campaniaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      responsable_nombre: ['', [Validators.maxLength(150)]],
      responsable_email: ['', [Validators.email]],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
      fecha_limite_registro: [null],
      presupuesto_total: [null, [Validators.required, Validators.min(0.01)]],
      presupuesto_restante: [null],
      ciclo_pago: ['mensual', [Validators.required, Validators.maxLength(20)]],
      activa: [true],
      limite_vehiculos_automatico: [true],
      limite_vehiculos: [null],
      requisitos: [''],
      sectores: this.fb.array([]),
      horarios: this.fb.array([]),
      rateGroups: this.fb.array([]), // Grupos por Vehículo
      km_minimo_conductor: [null, [Validators.required, Validators.min(0)]],
    }, { validators: [dateRangeValidator] });

    this.campaniaForm.get('presupuesto_total')?.valueChanges.subscribe(val => {
      this.campaniaForm.patchValue({ presupuesto_restante: val }, { emitEvent: false });
    });

    this.sectores.valueChanges.subscribe(() => this.updateSectoresOptions());

    this.addSector();
    this.addHorario();
    this.addVehicleGroup(); // Cargar el primer vehículo por defecto
    this.updateSectoresOptions();
  }

  get sectores() { return this.campaniaForm.get('sectores') as FormArray; }
  get horarios() { return this.campaniaForm.get('horarios') as FormArray; }
  get rateGroups() { return this.campaniaForm.get('rateGroups') as FormArray; }

  updateSectoresOptions() {
    this.sectoresOptions = this.sectores.controls.map((s, i) => {
      const sectorId = s.get('id')?.value;
      const sectorMock = this.mockSectores.find(ms => ms.id === sectorId);
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
      this.selectedSectorForPreview = this.mockSectores.find(s => s.id === sectorId);
      this.displaySectorPreview = true;
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un sector para previsualizar.' });
    }
  }

  goToCreateSectors() {
    // Por ahora solo una alerta o navegación simulada
    this.messageService.add({ severity: 'info', summary: 'Navegación', detail: 'Redirigiendo a creación de sectores...' });
    setTimeout(() => {
        this.router.navigate(['/company/administrar-sectores']);
    }, 1000);
  }

  addHorario() { this.horarios.push(this.fb.group({ dia: ['Lunes', Validators.required], hora_inicio: [null, Validators.required], hora_fin: [null, Validators.required] })); }
  removeHorario(index: number) { this.horarios.removeAt(index); }

  // --- Nueva Lógica de Grupos de Vehículo ---

  addVehicleGroup() {
    const group = this.fb.group({
      categoria_vehiculo: ['sedan', Validators.required],
      globalRates: this.fb.array([]), // Tarifas seleccionables para Sector Global
      sectorGroups: this.fb.array([])  // Grupos adicionales por sectores específicos
    });

    this.rateGroups.push(group);
    this.addGlobalRateRow(this.rateGroups.length - 1);
  }

  removeVehicleGroup(index: number) { this.rateGroups.removeAt(index); }

  getGlobalRates(vehicleIndex: number) {
    return this.rateGroups.at(vehicleIndex).get('globalRates') as FormArray;
  }

  addGlobalRateRow(vehicleIndex: number) {
    this.getGlobalRates(vehicleIndex).push(this.fb.group({
      tipo_brandeo: [1, Validators.required],
      valor: [0, [Validators.required, Validators.min(0.0001)]]
    }));
  }

  removeGlobalRateRow(vehicleIndex: number, rateIndex: number) {
    this.getGlobalRates(vehicleIndex).removeAt(rateIndex);
  }

  getSectorGroups(vehicleIndex: number) {
    return this.rateGroups.at(vehicleIndex).get('sectorGroups') as FormArray;
  }

  addSectorGroupToVehicle(vehicleIndex: number) {
    const group = this.fb.group({
      sector_index: [null, Validators.required],
      rates: this.fb.array([])
    });
    this.getSectorGroups(vehicleIndex).push(group);
    this.addRateRowToSector(vehicleIndex, this.getSectorGroups(vehicleIndex).length - 1);
  }

  removeSectorGroupFromVehicle(vehicleIndex: number, sectorGroupIndex: number) {
    this.getSectorGroups(vehicleIndex).removeAt(sectorGroupIndex);
  }

  getRatesFromSectorGroup(vehicleIndex: number, sectorGroupIndex: number) {
    return this.getSectorGroups(vehicleIndex).at(sectorGroupIndex).get('rates') as FormArray;
  }

  addRateRowToSector(vehicleIndex: number, sectorGroupIndex: number) {
    this.getRatesFromSectorGroup(vehicleIndex, sectorGroupIndex).push(this.fb.group({
      tipo_brandeo: [1, Validators.required],
      valor: [0, [Validators.required, Validators.min(0.0001)]]
    }));
  }

  removeRateRowFromSector(vehicleIndex: number, sectorGroupIndex: number, rateIndex: number) {
    this.getRatesFromSectorGroup(vehicleIndex, sectorGroupIndex).removeAt(rateIndex);
  }

  // Cálculos de Totales
  calculateGlobalTotal(vehicleIndex: number): number {
    return this.getGlobalRates(vehicleIndex).value.reduce((sum: number, r: any) => sum + (r.valor || 0), 0);
  }

  calculateSectorTotal(vehicleIndex: number, sectorGroupIndex: number): number {
    const globalRates = this.getGlobalRates(vehicleIndex).value;
    const sectorRates = this.getRatesFromSectorGroup(vehicleIndex, sectorGroupIndex).value;
    
    // Mapa para consolidar: Tipo Brandeo -> Valor
    const consolidatedRates = new Map<number, number>();

    // 1. Cargar bases globales
    globalRates.forEach((r: any) => {
      consolidatedRates.set(r.tipo_brandeo, r.valor || 0);
    });

    // 2. Sobreescribir con específicos del sector
    sectorRates.forEach((r: any) => {
      consolidatedRates.set(r.tipo_brandeo, r.valor || 0);
    });

    // 3. Sumar total consolidado
    let total = 0;
    consolidatedRates.forEach(valor => total += valor);
    return total;
  }

  onSubmit() {
    if (this.campaniaForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos requeridos.' });
      this.campaniaForm.markAllAsTouched();
      return;
    }

    const formValues = this.campaniaForm.getRawValue();
    const flattenedTarifas: Tarifa[] = [];

    formValues.rateGroups.forEach((vGroup: any) => {
      // 1. Añadir Tarifas Globales
      vGroup.globalRates.forEach((gr: any) => {
        if (gr.valor > 0) {
          flattenedTarifas.push({
            categoria_vehiculo: vGroup.categoria_vehiculo,
            sector: null, // Global
            tipo_brandeo: gr.tipo_brandeo,
            valor: gr.valor
          });
        }
      });

      // 2. Añadir Tarifas por Sectores
      vGroup.sectorGroups.forEach((sGroup: any) => {
        sGroup.rates.forEach((r: any) => {
          flattenedTarifas.push({
            categoria_vehiculo: vGroup.categoria_vehiculo,
            sector: sGroup.sector_index,
            tipo_brandeo: r.tipo_brandeo,
            valor: r.valor
          });
        });
      });
    });

    const payload: CampaniaCreacion = {
      empresa_id: 1, // Stub
      nombre: formValues.nombre,
      responsable_nombre: formValues.responsable_nombre,
      responsable_email: formValues.responsable_email,
      fecha_inicio: this.formatDate(formValues.fecha_inicio),
      fecha_fin: this.formatDate(formValues.fecha_fin),
      fecha_limite_registro: formValues.fecha_limite_registro ? this.formatDate(formValues.fecha_limite_registro) : null,
      presupuesto_total: formValues.presupuesto_total,
      presupuesto_restante: formValues.presupuesto_restante,
      km_minimo_conductor: formValues.km_minimo_conductor,
      limite_vehiculos: formValues.limite_vehiculos_automatico ? 0 : formValues.limite_vehiculos,
      ciclo_pago: formValues.ciclo_pago,
      activa: formValues.activa,
      tarifas: flattenedTarifas
    };

    console.log('Payload Final:', payload);
    this.messageService.add({ severity: 'success', summary: 'Publicado', detail: 'Campaña creada con éxito.' });
    setTimeout(() => this.router.navigate(['/company/mis-campanias']), 2000);
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  cancelar() { this.router.navigate(['/company/mis-campanias']); }
}
