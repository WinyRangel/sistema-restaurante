import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionService {
  private apiUrl = 'http://localhost:3002/api/puntuacion';

  constructor(private http: HttpClient) { }

  obtenerPuntuaciones(bebidaId?: number, platilloId?: number): Observable<any> {
    let params = {};
    if (bebidaId) {
      params = { bebidaId: bebidaId.toString() };
    } else if (platilloId) {
      params = { platilloId: platilloId.toString() };
    }
    
    return this.http.get(this.apiUrl, { params });
  }
  
  agregarPuntuacion(puntuacionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar`, puntuacionData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  
  obtenerPuntuacionPromedio(bebidaId?: number, platilloId?: number): Observable<any> {
    let params = new HttpParams();
    if (bebidaId) {
      params = params.set('bebidaId', bebidaId.toString());
    } else if (platilloId) {
      params = params.set('platilloId', platilloId.toString());
    }
    
    return this.http.get(`${this.apiUrl}/promedio`, { params });
  }


  
}
