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

    agregarCarrito(item: { userId: number, platilloId: number, cantidad: number }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/agregar`, item);
    }
}