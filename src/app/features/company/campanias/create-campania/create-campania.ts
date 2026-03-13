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

  mockMarcas = [
    { id: 1, nombre: 'Toyota' },
    { id: 2, nombre: 'Honda' },
    { id: 3, nombre: 'Nissan' },
    { id: 4, nombre: 'Hyundai' },
    { id: 5, nombre: 'Kia' },
    { id: 6, nombre: 'Chevrolet' },
    { id: 7, nombre: 'Ford' },
    { id: 8, nombre: 'Volkswagen' }
  ];

  mockModelos = [
    { id: 1, marca_id: 1, nombre: 'Corolla' },
    { id: 2, marca_id: 1, nombre: 'Yaris' },
    { id: 3, marca_id: 1, nombre: 'Hilux' },
    { id: 4, marca_id: 2, nombre: 'Civic' },
    { id: 5, marca_id: 2, nombre: 'CR-V' },
    { id: 6, marca_id: 3, nombre: 'Sentra' },
    { id: 7, marca_id: 3, nombre: 'Versa' }
  ];

  fullVehiclesCatalog: any[] = [
    { categoria: 'sedan', marca: 'Toyota', modelo: 'Corolla' },
    { categoria: 'sedan', marca: 'Toyota', modelo: 'Yaris' },
    { categoria: 'sedan', marca: 'Honda', modelo: 'Civic' },
    { categoria: 'sedan', marca: 'Nissan', modelo: 'Sentra' },
    { categoria: 'suv', marca: 'Toyota', modelo: 'RAV4' },
    { categoria: 'suv', marca: 'Honda', modelo: 'CR-V' },
    { categoria: 'camioneta', marca: 'Toyota', modelo: 'Hilux' },
    { categoria: 'camioneta', marca: 'Ford', modelo: 'Ranger' },
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
      limite_vehiculos: [null],
      requisitos: [''],
      sectores: this.fb.array([]),
      horarios: this.fb.array([]),
      vehiculosAdmisibles: this.fb.array([]),
      tarifasConfig: this.fb.array([]), // Flat Rules System
      km_minimo_conductor: [null, [Validators.required, Validators.min(0)]],
    }, { validators: [dateRangeValidator] });

    this.campaniaForm.get('presupuesto_total')?.valueChanges.subscribe(val => {
      this.campaniaForm.patchValue({ presupuesto_restante: val }, { emitEvent: false });
    });

    this.addSector();
    this.addHorario();
    this.initVehiculosCatalog();
    this.addTarifaRule(); // Cargar la primera regla por defecto
  }

  get sectores() { return this.campaniaForm.get('sectores') as FormArray; }
  get horarios() { return this.campaniaForm.get('horarios') as FormArray; }
  get tarifasConfig() { return this.campaniaForm.get('tarifasConfig') as FormArray; }
  get vehiculosAdmisibles() { return this.campaniaForm.get('vehiculosAdmisibles') as FormArray; }

  initVehiculosCatalog() {
    const sortedCatalog = [...this.fullVehiclesCatalog].sort((a, b) => {
      const catCompare = a.categoria.localeCompare(b.categoria);
      if (catCompare !== 0) return catCompare;
      return a.marca.localeCompare(b.marca);
    });

    sortedCatalog.forEach((v) => {
      this.vehiculosAdmisibles.push(
        this.fb.group({
          categoria: [v.categoria],
          marca: [v.marca],
          modelo: [v.modelo],
          seleccionado: [false],
          anio_minimo: [2015, [Validators.required, Validators.min(1900)]],
        })
      );
    });
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
      const sectorMock = this.mockSectores.find(ms => ms.id === sectorId);
      return { label: sectorMock?.nombre || `Sector ${i + 1}`, value: sectorId };
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
      const sectorMock = this.mockSectores.find(ms => ms.id === sectorId);
      return { label: sectorMock?.nombre || `Sector ${i + 1}`, value: sectorId };
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

  getEffectiveRate(sectorId: number | null, horarioIdx: number | null, categoria: string): number {
    let total = 0;
    this.brandingPartsCatalog.forEach(part => {
      const rules = this.tarifasConfig.value as any[];
      const rule = rules
        .filter(r => r.tipo_brandeo === part.value && r.categoria_vehiculo === categoria)
        .sort((a, b) => {
          const scoreA = (a.sector_id !== null ? 2 : 0) + (a.horario_index !== null ? 1 : 0);
          const scoreB = (b.sector_id !== null ? 2 : 0) + (b.horario_index !== null ? 1 : 0);
          return scoreB - scoreA;
        })[0];
      if (rule) total += rule.valor;
    });
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

    formValues.tarifasConfig.forEach((rule: any) => {
        flattenedTarifas.push({
          categoria_vehiculo: rule.categoria_vehiculo,
          sector: rule.sector_id,
          tipo_brandeo: rule.tipo_brandeo,
          valor: rule.valor
        });
    });

    const selectedVehiculos = formValues.vehiculosAdmisibles
      .filter((v: any) => v.seleccionado)
      .map((v: any) => ({
        marca: v.marca,
        modelo: v.modelo,
        categoria: v.categoria,
        anio_minimo: v.anio_minimo,
        activo: true
      }));

    const payload: CampaniaCreacion = {
      empresa_id: 1, 
      nombre: formValues.nombre,
      responsable_nombre: formValues.responsable_nombre,
      responsable_email: formValues.responsable_email,
      fecha_inicio: this.formatDate(formValues.fecha_inicio),
      fecha_fin: this.formatDate(formValues.fecha_fin),
      fecha_limite_registro: formValues.fecha_limite_registro ? this.formatDate(formValues.fecha_limite_registro) : null,
      presupuesto_total: formValues.presupuesto_total,
      presupuesto_restante: formValues.presupuesto_restante,
      km_minimo_conductor: formValues.km_minimo_conductor,
      limite_vehiculos: formValues.limite_vehiculos,
      ciclo_pago: formValues.ciclo_pago,
      activa: formValues.activa,
      tarifas: flattenedTarifas,
      vehiculos_admisibles: selectedVehiculos
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
