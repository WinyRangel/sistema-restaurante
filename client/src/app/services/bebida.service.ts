import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bebida } from '../Interfaces/Bebida';

@Injectable({
  providedIn: 'root'
})
export class BebidaService {
  private apiUrl = 'http://3.128.24.47:3002/api/bebidas';

  constructor(private http: HttpClient) { }

  getBebidas(): Observable<Bebida[]> {
    return this.http.get<Bebida[]>(this.apiUrl);
  }

  getBebidaById(id: number): Observable<Bebida> {
    return this.http.get<Bebida>(`${this.apiUrl}/${id}`);
  }

  createBebida(bebida: FormData): Observable<Bebida> {
    return this.http.post<Bebida>(this.apiUrl, bebida);
  }

  updateBebida(id: number, bebida: FormData): Observable<Bebida> {
    return this.http.put<Bebida>(`${this.apiUrl}/${id}`, bebida);
  }  

  deleteBebida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  agregarCarrito(item: { carritoId: number, bebidaId: number, cantidad: number }): Observable<any> {
    return this.http.post<any>('http://3.128.24.47:3002/api/carrito', item);
  }

  
}
