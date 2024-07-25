import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CarritoService {
private apiUrl = 'http://localhost:3002/api/carrito';

constructor(private http: HttpClient) { }

mostrarCarrito(carritoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mostrar/${carritoId}`);
}

}