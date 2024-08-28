import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario } from '../Interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private rol: string = '';
  private url = 'http://localhost:3002/api/users'; // URL base para las operaciones de usuario
  private urlRegistro = 'http://localhost:3002/api/users/registro'; // URL para el registro de usuario
  private urlLogin = 'http://localhost:3002/api/users/login'; // URL para iniciar sesión
  private authStatusListener = new Subject<boolean>();  
  private carritoId: number | null = null;  

  constructor(private http: HttpClient, private router: Router) { 
    // Inicializa el estado de autenticación y rol desde el almacenamiento local
    this.isAuthenticated = this.getLocalStorageItem('token') ? true : false;
    this.rol = this.getLocalStorageItem('rol') || '';    
  }

  // Métodos para gestionar el almacenamiento local
  private setLocalStorageItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }

  private getLocalStorageItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeLocalStorageItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }

  // Configura el estado de autenticación y el rol del usuario
  setAuthentication(status: boolean, rol: string): void {
    this.isAuthenticated = status;
    this.rol = rol;

    if (status) {
      const token = this.getToken(); // Obtén el token real aquí
      this.setLocalStorageItem('token', token || ''); // Usa el token real
      this.setLocalStorageItem('rol', rol);
    } else {
      this.removeLocalStorageItem('token');
      this.removeLocalStorageItem('rol');
    }
  }

  getUserRole(): string {
    return this.rol;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  // Registra un nuevo usuario
  registrarUsuario(datosUsuario: any): Observable<any> {
    return this.http.post<any>(this.urlRegistro, datosUsuario).pipe(
      catchError(this.handleError)
    );
  }

  // Maneja errores HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('Ha ocurrido un error:', error.message);
    return throwError('Si persiste el error, intente nuevamente después');
  }

  // Inicia sesión y guarda el token en el almacenamiento local
  inicioSesion(user: any): Observable<any> {
    return this.http.post<any>(this.urlLogin, user).pipe(
      tap(response => {
        if (response.token) {
          this.setAuthentication(true, response.rol); // Cambia aquí
          this.setLocalStorageItem('token', response.token);
          this.authStatusListener.next(true); 

          // Decodifica el token para obtener el carritoId
          const decodedToken = this.parseJwt(response.token);
          this.carritoId = decodedToken.carritoId;
        }
      }),
      catchError(this.handleError)
    );
  }

  // Verifica si el usuario está autenticado
  estaAutenticado(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      if (decodedToken) {
        // También podrías verificar si el token ha expirado
        return true;
      }
    }
    return false;
  }

  // Cierra la sesión del usuario
  cerrarSesion() {
    this.removeLocalStorageItem('token');
    this.removeLocalStorageItem('rol');
    this.authStatusListener.next(false);  
    this.carritoId = null;  
    this.router.navigate(['/signin']);
  }

  // Obtiene el token almacenado en el almacenamiento local
  getToken(): string | null {
    return this.getLocalStorageItem('token');
  }

  // Decodifica el token JWT
  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error al parsear el JWT:', error);
      return {};
    }
  }

  // Obtiene el nombre del usuario desde el token
  obtenerNombreUsuario(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      return decodedToken ? decodedToken.nombre : null;
    }
    return null;
  }

  // Obtiene el ID del carrito del usuario desde el token
  getCarritoId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      return decodedToken ? decodedToken.carritoId : null;
    }
    return null;
  }

  // Obtiene el ID del usuario desde el token
  getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      return decodedToken ? decodedToken.usuarioId : null;
    }
    return null;
  }

  // Obtiene el rol del usuario desde el token
  obtenerRol(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      return decodedToken ? decodedToken.rol : null;
    }
    return null;
  }

  // Obtiene la lista de usuarios
  obtenerUsuarios(): Observable<any> {
    return this.http.get(this.url);
  }

  // Elimina un usuario por ID
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
