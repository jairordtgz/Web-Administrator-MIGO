import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
import { StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-create-campania',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    CheckboxModule,
    DatePickerModule,
    TextareaModule,
    ToastModule,
    StepperModule,
    CardModule,
    DividerModule,
    ToggleButtonModule
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

  tiposBrandeo = [
    { label: 'Toda la carrocería', value: 'integral' },
    { label: 'Solo puertas', value: 'puertas' },
    { label: 'Solo ventanas', value: 'ventanas' },
    { label: 'Solo capó', value: 'capo' }
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.campaniaForm = this.fb.group({
      // Paso 1: Datos Básicos
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
      presupuesto: [null, [Validators.required, Validators.min(1)]],
      cicloPago: ['mensual', Validators.required],
      
      // Paso 2: Vehículos y Requisitos
      limiteVehiculosAutomatico: [true],
      limiteVehiculos: [null],
      sedan_admisible: [true],
      suv_admisible: [true],
      camioneta_admisible: [false],
      camion_admisible: [false],
      bus_admisible: [false],
      requisitos: [''],
      tipoBrandeo: ['integral', Validators.required],

      // Paso 3: Ubicación y Horarios
      sectores: this.fb.array([]),
      horarios: this.fb.array([]),

      // Paso 4: Tarifas y Pagos
      tarifaKm: [null, [Validators.required, Validators.min(0)]],
      kmMinimoConductor: [null, [Validators.required, Validators.min(1)]],
      
      // Tarifas por tipo (opcional, si se quiere detallar)
      tarifaSedan: [null],
      tarifaSuv: [null],
      tarifaCamioneta: [null]
    });

    // Añadir al menos un sector y un horario por defecto para la maqueta
    this.addSector();
    this.addHorario();
  }

  get sectores() {
    return this.campaniaForm.get('sectores') as FormArray;
  }

  get horarios() {
    return this.campaniaForm.get('horarios') as FormArray;
  }

  addSector() {
    const sectorForm = this.fb.group({
      nombre: ['', Validators.required],
      tarifaEspecial: [null]
    });
    this.sectores.push(sectorForm);
  }

  removeSector(index: number) {
    this.sectores.removeAt(index);
  }

  addHorario() {
    const horarioForm = this.fb.group({
      dia: ['Lunes', Validators.required],
      horaInicio: [null, Validators.required],
      horaFin: [null, Validators.required]
    });
    this.horarios.push(horarioForm);
  }

  removeHorario(index: number) {
    this.horarios.removeAt(index);
  }

  onSubmit() {
    if (this.campaniaForm.invalid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor, completa todos los campos requeridos.' 
      });
      return;
    }

    console.log('Datos de la campaña:', this.campaniaForm.value);
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Campaña maquetada correctamente (Simulación).' 
    });

    setTimeout(() => {
      this.router.navigate(['/company/mis-campanias']);
    }, 2000);
  }

  cancelar() {
    this.router.navigate(['/company/mis-campanias']);
  }
}
