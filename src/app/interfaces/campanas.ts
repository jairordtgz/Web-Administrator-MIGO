import { Company } from './company';

export interface Tarifa {
    id?: number;
    campania?: number;
    sector?: number | null;
    categoria_vehiculo: string;
    tipo_brandeo: number; // ID of TipoBrandeoCatalogo
    valor: number;
}

export interface CampaniaCreacion {
    empresa_id: number;
    nombre: string;
    responsable_nombre?: string | null;
    responsable_email?: string | null;
    fecha_inicio: string;
    fecha_fin: string;
    fecha_limite_registro?: string | null;
    presupuesto_total: number;
    presupuesto_restante: number;
    km_minimo_conductor: number;
    limite_vehiculos: number;
    ciclo_pago?: string;
    activa?: boolean;
    tipo_brandeo_id?: number | null;
    tarifas?: Tarifa[];
    vehiculos_admisibles?: CatalogoVehiculo[];
}

export interface CampaniaList {
    id?: number;
    nombre: string;
    responsable_nombre?: string | null;
    responsable_email?: string | null;
    fecha_inicio: string;
    fecha_fin: string;
    fecha_limite_registro?: string | null;
    presupuesto_total: number;
    presupuesto_restante: number;
    km_minimo_conductor: number;
    limite_vehiculos: number;
    ciclo_pago?: "semanal" | "quincenal" | "mensual";
    activa?: boolean;
    estado?: string;
    fecha_creacion?: string;
    tipo_brandeo?: number | null;
    empresa: number;
}

export interface CatalogoVehiculo {
    id?: number;
    marca: string;
    modelo: string;
    categoria: "sedan" | "suv" | "camioneta" | "camion" | "moto";
    anio_minimo?: number | null;
    activo?: boolean;
}

export interface TipoBrandeo {
    id?: number;
    nombre: string;
    tipo_material: string;
    activo?: boolean;
}

// Keep legacy for existing code compatibility if any, or remove if unused
export interface Campania {
  id_campana: number
  nombre_campana: string
  correo_responsable: string
  id_sector: number
  fecha_inicio: string
  fecha_fin: string
  fecha_fin_registro: string
  presupuesto: number
  nombre_responsable: string
  tarifa_base: number
  tarifa_min: number
  tarifa_max: number
  hora_monetizable_inicio: string
  hora_monetizable_fin: string
  cobro_minimo: number
  tipo_brandeo: string
  taller_brandeo: number
  carroceria_capo: boolean
  puerta_conductor: boolean
  puerta_pasajero: boolean
  puerta_traseratzq: boolean
  puerta_traseraDer: boolean
  carroceria_guantera: boolean
  carroceria_techo: boolean
  fecha_creacion: string
  fecha_modificacion: string
  estado: number
  sedan_admisible: boolean,
  suv_admisible: boolean,
  camion_admisible: boolean,
  camioneta_admisible: boolean,
  bus_admisible: boolean,
  id_empresa: number,
  id_ciudad: number,
  id_pais: number
}
