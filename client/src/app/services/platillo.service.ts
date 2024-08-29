import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platillo } from '../interfaces/Platillo';

@Injectable({
  providedIn: 'root'
})
export class PlatilloService {
  private apiUrl = 'http://3.128.24.47:3002/api/platillos';
  private carrito = 'http://3.128.24.47:3002/api/carrito/actualizar'

  constructor(private http: HttpClient) { }

  getPlatillos(): Observable<Platillo[]> {
    return this.http.get<Platillo[]>(this.apiUrl);
  }

  getPlatilloById(id: number): Observable<Platillo> {
    return this.http.get<Platillo>(`${this.apiUrl}/${id}`);
  }

  createPlatillo(platillo: FormData): Observable<Platillo> {
    return this.http.post<Platillo>(this.apiUrl, platillo);
  }

  updatePlatillo(id: number, platillo: FormData): Observable<Platillo> {
    return this.http.put<Platillo>(`${this.apiUrl}/${id}`, platillo);
  }  

  deletePlatillo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  agregarCarrito(item: { carritoId: number, platilloId: number, cantidad: number }): Observable<any> {
    return this.http.post<any>('http://3.128.24.47:3002/api/carrito', item);
  }

  actualizarCarrito(data: { carritoId: number, platilloId: number, cantidad: number }): Observable<any> {
    // Definir la URL para actualizar el carrito
    const carrito = `http://3.128.24.47:3002/api/carrito`;

    // Hacer la solicitud POST al backend
    return this.http.post(carrito, data);
  }
}
