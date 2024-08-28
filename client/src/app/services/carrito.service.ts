import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private static instance: CarritoService;
  private apiUrl = 'http://localhost:3002/api/carrito';

  constructor(private http: HttpClient) { }

  public static getInstance(http: HttpClient): CarritoService {
    if (!CarritoService.instance) {
      CarritoService.instance = new CarritoService(http);
    }
    return CarritoService.instance;
  }

  mostrarCarrito(carritoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mostrar/${carritoId}`);
  }

  eliminarArticulo(itemCarritoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${itemCarritoId}`);
  }

  vaciarCarrito(carritoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/vaciar/${carritoId}`);
  }

  agregarCarrito(item: { userId: number, platilloId: number, cantidad: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agregar`, item);
  }

  // Nuevo método para obtener todos los carritos
  getCarritos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/todos`);
  }

  // Nuevo método para actualizar el estado de un carrito
  actualizarEstado(carritoId: number, estado: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar-estado/${carritoId}`, { estado });
  }

  // Implementación del método para actualizar la cantidad de un artículo
  actualizarCantidadArticulo(itemCarritoId: number, cantidad: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar-cantidad/${itemCarritoId}`, { cantidad });
  }
}

