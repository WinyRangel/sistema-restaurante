import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3002/api/payment'; // Cambia esto según la URL de tu backend

  constructor(private http: HttpClient) {}

//   createOrder(): Observable<any> {
//     return this.http.post(`${this.apiUrl}/create-order`, {});
//   }

  createOrder(total: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, { total });
  }

  captureOrder(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/capture-order?token=${token}`, {});
  }

  cancelPayment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cancel-payment`);
  }
}
