import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platillo } from '../interfaces/Platillo';

@Injectable({
  providedIn: 'root'
})
export class PlatilloService {
  private apiUrl = 'http://localhost:3002/api/platillos';

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
}
