import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlRegistro = 'http://localhost:3002/api/users/registro';
  private url = 'http://localhost:3002/api/users/login';


  constructor(private http: HttpClient) { }
  //Registrar usuario
  registrarUsuario(datosUsuario: any): Observable<any> {
    return this.http.post<any>(this.urlRegistro, datosUsuario).pipe(
      catchError(this.handleError)
    );
  }
  //Maneja errores en caso de que no se haya registrado el usuario
    private handleError(error: HttpErrorResponse) {
      console.error('Ha ocurrido un error:', error.message);
      return throwError('Si persiste el error, intente nuevamente después');
    }
    //Iniciar sesion metodo
    inicioSesion(user: any): Observable<any> {
      return this.http.post<any>(this.url, user).pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
    }

    cerrarSesion() {
      // Eliminar el token del localStorage al cerrar sesión
      localStorage.removeItem('token');
    }

    getToken(): string | null {
      // Obtener el token del localStorage
      return localStorage.getItem('token');
    }

    estaAutenticado(): boolean {
      // Verifica si hay un token en el localStorage
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

    obtenerRol(): string | null {
      const token = this.getToken();
      console.log('Token:', token); // Verifica si el token está presente
      if (token) {
        const decodedToken = this.parseJwt(token);
        console.log('Decoded token:', decodedToken); // Verifica el token decodificado
        return decodedToken ? decodedToken.rol : null;
      }
      return null;
    }
}
