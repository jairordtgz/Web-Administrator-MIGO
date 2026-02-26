import { User } from './user';


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
}

export interface RegisterCompanyDTO extends 
    Pick<User, 'username' | 'email' | 'first_name' | 'last_name' | 'password'>,
    Pick<Company, 'nombre' | 'ruc' | 'direccion' | 'nombre_representante' | 'contacto_representante' | 'habilitada'> {
}

export type Empresa = Company;
