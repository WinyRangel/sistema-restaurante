import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private rol: string = '';
  private urlRegistro = 'http://localhost:3002/api/users/registro';
  private urlLogin = 'http://localhost:3002/api/users/login';
  private authStatusListener = new Subject<boolean>();  
  private carritoId: number | null = null;  

  constructor(private http: HttpClient, private router: Router) { 
    this.isAuthenticated = this.getLocalStorageItem('token') ? true : false;
    this.rol = this.getLocalStorageItem('rol') || '';    
  }

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

  setAuthentication(status: boolean, rol: string): void {
    this.isAuthenticated = status;
    this.rol = rol;
  
    if (status) {
      this.setLocalStorageItem('token', 'dummy_token');
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

  registrarUsuario(datosUsuario: any): Observable<any> {
    return this.http.post<any>(this.urlRegistro, datosUsuario).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ha ocurrido un error:', error.message);
    return throwError('Si persiste el error, intente nuevamente después');
  }

  inicioSesion(user: any): Observable<any> {
    return this.http.post<any>(this.urlLogin, user).pipe(
      tap(response => {
        if (response.token) {
          this.setLocalStorageItem('token', response.token);
          this.authStatusListener.next(true); 
          
          const decodedToken = this.parseJwt(response.token);
          this.carritoId = decodedToken.carritoId;
        }
      }),
      catchError(this.handleError)
    );
  }

  estaAutenticado(): boolean {
    return this.getLocalStorageItem('token') ? true : false;
  }

  cerrarSesion() {
    this.removeLocalStorageItem('token');
    this.removeLocalStorageItem('rol');
    this.authStatusListener.next(false);  
    this.carritoId = null;  
    this.router.navigate(['/signin']);
  }

  getToken(): string | null {
    return this.getLocalStorageItem('token');
  }

  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      return null;
    }
  }

  obtenerNombreUsuario(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      return decodedToken ? decodedToken.nombre : null;
    }
    return null;
  }

  getCarritoId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      return decodedToken ? decodedToken.carritoId : null;
    }
    return null;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      return decodedToken ? decodedToken.usuarioId : null;
    }
    return null;
  }

  obtenerRol(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.parseJwt(token);
      return decodedToken ? decodedToken.rol : null;
    }
    return null;
  }
}
