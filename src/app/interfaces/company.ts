import { User } from './user';
import { PaginatedResponse } from './pagination';

export interface Company {
    id?: number;
    usuario?: number | User;
    nombre: string;
    ruc: string;
    tipo_empresa?: string | 'marca' | 'publicista';
    direccion: string;
    nombre_representante: string;
    contacto_representante: string;
    habilitada?: boolean;
    
    // API combined fields from User
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    fecha_creacion?: string;
    token_notificacion?: string | null;
    foto_perfil?: string | null;
}

export interface RegisterCompanyDTO extends 
    Pick<User, 'username' | 'email' | 'first_name' | 'last_name' | 'password'>,
    Pick<Company, 'nombre' | 'ruc' | 'direccion' | 'nombre_representante' | 'contacto_representante' | 'habilitada'> {
}

export type Empresa = Company;

export type CompanyResponse = PaginatedResponse<Company>;
