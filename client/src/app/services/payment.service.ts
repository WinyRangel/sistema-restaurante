import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://3.128.24.47:3002/api/payment'; // Cambia esto según la URL de tu backend

  constructor(private http: HttpClient, private authService: AuthService) {}

//   createOrder(): Observable<any> {
//     return this.http.post(`${this.apiUrl}/create-order`, {});
//   }

private getAuthToken(): string | null {
  return localStorage.getItem('token');
}

  createOrder(total: number): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/create-order`, { total }, { headers });
  }

  captureOrder(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/capture-order?token=${token}`, {});
  }
  
  cancelPayment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cancel-payment`);
  }

  saveCart(total: number, tipoPagoId: number): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/save-cart`, { total, tipoPagoId }, { headers });
}

  // saveCart(): Observable<any> {
  //   const token = this.getAuthToken();
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   return this.http.post(`${this.apiUrl}/save-cart`, { headers });
  // }

}
