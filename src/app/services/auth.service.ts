import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private resetEmail: string = '';

  constructor() { }

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
    return of({ success: true, message: 'Correo enviado' }).pipe(delay(1500));
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
  updatePassword(password: string): Observable<any> {
    console.log(`Actualizando contraseña para: ${this.resetEmail}`);
    return of({ success: true }).pipe(delay(1500));
  }
}
