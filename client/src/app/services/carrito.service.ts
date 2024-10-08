import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CarritoService {
    private static instance: CarritoService;
    private apiUrl = 'http://3.128.24.47:3002/api/carrito';
    
    constructor(private http: HttpClient) { }

    public static getInstance(http: HttpClient): CarritoService{
        if(!CarritoService.instance){ //Verificando la propiedad estatica de la clase, instance almacena una sola instancia del carrtiservice
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

    actualizarCantidadArticulo(itemCarritoId: number, cantidad: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/actualizar-cantidad`, { itemCarritoId, cantidad });
    }

    obtenerOrdenes(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/ordenes`);
    }
    
    obtenerOrdenesPorUsuario(usuarioId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/ordenes/${usuarioId}`);
    }

    actualizarEstadoOrden(ordenId: number, nuevoEstado: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/estatus/${ordenId}`, { nuevoEstado });
    }
    
    // agregarCarrito(item: { userId: number, platilloId: number, cantidad: number }): Observable<any> {
    //     return this.http.post<any>(`${this.apiUrl}/agregar`, item);
    // }
}