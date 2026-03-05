import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { AuthResponse, LoginCredentials, AuthUser } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/login/login';
  private resetEmail: string = '';

  constructor() { }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveUser(response.usuario);
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  saveUser(user: AuthUser) {
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('company_name', user.first_name);
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('company_name');
  }

  setResetEmail(email: string) {
    this.resetEmail = email;
  }

  getResetEmail() {
    return this.resetEmail;
  }

  /**
   * Envía un correo de recuperación (Simulado)
   */
  sendResetEmail(email: string): Observable<any> {
    console.log(`Enviando correo de recuperación a: ${email}`);
    this.setResetEmail(email);
    //return of({ success: true, message: 'Correo enviado' }).pipe(delay(1500));
    return this.http.post('http://127.0.0.1:8000/autenticacion/restablecer-contrasenia/', { email });
  }

  /**
   * Verifica el token ingresado (Simulado)
   */
  verifyToken(token: string): Observable<any> {
    console.log(`Verificando token ${token} para: ${this.resetEmail}`);
    return of({ success: true }).pipe(delay(1000));
  }

  /**
   * Actualiza la contraseña (Simulado)
   */
  updatePassword(nuevaPassword: string, uid: string, token: string): Observable<any> {
    console.log(`Actualizando contraseña para: ${this.resetEmail}`);
    //return of({ success: true }).pipe(delay(1500));

    const payload = {
      uid: uid,
      token: token,
      nueva_password: nuevaPassword
    };

    return this.http.post('http://127.0.0.1:8000/autenticacion/confirmar-contrasenia/', payload);
  }
}
