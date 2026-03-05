import { Company } from './company';

export interface Publicista {
    id: number;
    nombre: string;
    usuario: {
        id_usuario: number;
        username: string;
        email: string;
    };
}

export interface PublicistCompany extends Company {
    publicistas?: Publicista[];
}
