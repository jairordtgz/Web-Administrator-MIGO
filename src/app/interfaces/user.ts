export enum EstadoUsuario {
    INACTIVO = 'inactivo',
    ACTIVO = 'activo',
    DESHABILITADO = 'deshabilitado'
}

export enum RolUsuario {
    CONDUCTOR = 'conductor',
    EMPRESA = 'empresa',
    PUBLICISTA = 'publicista',
    ADMINISTRADOR = 'administrador'
}

export interface User {
    id?: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
    tipo_usuario?: RolUsuario;
    estado?: EstadoUsuario;
    fecha_creacion?: string;
    fecha_modificacion?: string;
}
