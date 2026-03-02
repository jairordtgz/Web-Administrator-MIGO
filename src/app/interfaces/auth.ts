export interface AuthUser {
    id_usuario: number;
    first_name: string;
    tipo_usuario: string;
    permisos: any;
}

export interface AuthResponse {
    token: string;
    usuario: AuthUser;
}

export interface LoginCredentials {
    username: string;
    password: string;
}
