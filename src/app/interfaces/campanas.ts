import { Company } from './company';
import { PaginatedResponse } from './pagination';

export interface Tarifa {
    id?: number;
    campania?: number;
    sector?: number | null;
    categoria_vehiculo: string;
    tipo_brandeo: number; // ID of TipoBrandeoCatalogo
    valor: number;
}

export interface SectorCreacion {
    nombre: string;
    coordenadas_cerco?: any;
}

export interface HorarioCreacion {
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
}

export interface TarifaCreacion {
    tipo_brandeo_id: number;
    categoria_vehiculo: string;
    valor: number;
    sector_index: number;
    horario_index: number;
}

export interface ReglaVehiculo {
    marca: string;
    categoria: string;
    anio_minimo?: number | null;
}

export interface CampaniaCreacion {
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    fecha_limite_registro?: string | null;
    presupuesto_total: number;
    km_minimo_conductor: number;
    limite_vehiculos_permitidos: number | null;
    limite_vehiculos_automatico: boolean;
    ciclo_pago: string;
    requisitos?: string;
    sectores: SectorCreacion[];
    tarifas: TarifaCreacion[];
    horarios: HorarioCreacion[];
    reglas_vehiculos?: ReglaVehiculo[];
}

export interface CampaniaList {
    id: number;
    nombre: string;
    responsable_nombre?: string | null;
    responsable_email?: string | null;
    fecha_inicio: string;
    fecha_fin: string;
    fecha_limite_registro?: string | null;
    presupuesto_total: string | number;
    presupuesto_restante: string | number;
    km_minimo_conductor: string | number;
    requisitos?: string;
    limite_vehiculos_permitidos?: number | null;
    limite_vehiculos_automatico?: boolean;
    ciclo_pago?: "semanal" | "quincenal" | "mensual";
    activa?: boolean;
    estado?: string;
    fecha_creacion?: string;
    empresa?: number;
    sectores?: {
        id: number;
        nombre: string;
        coordenadas_cerco: any[];
    }[];
    horarios?: {
        id: number;
        dia_semana: string;
        hora_inicio: string;
        hora_fin: string;
    }[];
    tarifas?: {
        id: number;
        sector: number;
        sector_nombre: string;
        horario: number;
        horario_detalle: string;
        categoria_vehiculo: string;
        categoria_vehiculo_nombre?: string;
        categoria_veh_nombre?: string;
        tipo_brandeo: number;
        tipo_brandeo_nombre: string;
        valor: string | number;
    }[];
    vehiculos_permitidos?: {
        id: number;
        marca: string;
        categoria: string;
        categoria_nombre: string;
        anio_minimo: number;
    }[];
}

export interface CatalogoVehiculo {
    id?: number;
    id_catalogo?: number;
    id_vehiculo?: number;
    marca: string;
    modelo: string;
    categoria: "sedan" | "suv" | "camioneta" | "camion" | "moto";
    anio_minimo?: number | null;
    activo?: boolean;
}

export type CatalogoVehiculoResponse = PaginatedResponse<CatalogoVehiculo>;

export interface TipoBrandeo {
    id_brandeo: number;
    nombre: string;
    tipo_material: string;
    activo: boolean;
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
