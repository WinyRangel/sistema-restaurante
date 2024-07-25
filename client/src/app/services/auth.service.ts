import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlRegistro = 'http://localhost:3002/api/users/registro';
  private url = 'http://localhost:3002/api/users/login';
  private authStatusListener = new Subject<boolean>();  // Subject para el estado de autenticación
  private carritoId: number | null = null;  // Almacenar carritoId

  constructor(private http: HttpClient, private router: Router) { }

  // Observable para el estado de autenticación
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
    return this.http.post<any>(this.url, user).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.authStatusListener.next(true);  // Notifica que el usuario está autenticado
          
          // Decodifica el token para obtener carritoId
          const decodedToken = this.parseJwt(response.token);
          this.carritoId = decodedToken.carritoId;
        }
      })
    );
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.authStatusListener.next(false);  // Notifica que el usuario no está autenticado
    this.carritoId = null;  // Resetea carritoId
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  estaAutenticado(): boolean {
    //verifica si hay un token en el localstorage
    return !!localStorage.getItem('token');
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
}
