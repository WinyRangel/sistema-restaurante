import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carritoItems: any[] = [];
  total: number = 0; 
  private carritoService: CarritoService;


  constructor(private http: HttpClient, private authService: AuthService, private paymentService: PaymentService) {
    this.carritoService = CarritoService.getInstance(this.http);
   }

  ngOnInit(): void {
    this.mostrarCarrito();
  }

  mostrarCarrito(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      Swal.fire('Error', 'No se puede mostrar el carrito, usuario no autenticado', 'error');
      return;
    }

    this.carritoService.mostrarCarrito(userId).subscribe(
      (data) => {
        this.carritoItems = data;
        this.calcularTotal(); 
      },
      (error) => {
        console.error('Error al obtener el carrito', error);
        Swal.fire('Error', 'No se pudo cargar el carrito', 'error');
      }
    );
  }
  
  calcularTotal(): void {
    this.total = this.carritoItems.reduce((acc, item) => {
      const precio = item.precioPlatillo || item.precioBebida || 0;
      return acc + (precio * item.cantidad);
    }, 0);
  }

  eliminarArticulo(itemCarritoId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.eliminarArticulo(itemCarritoId).subscribe(
          () => {
            Swal.fire('Éxito', 'El artículo ha sido actualizado', 'success');
            this.mostrarCarrito(); // Actualiza la lista del carrito después de la modificación
          },
          (error) => {
            console.error('Error al modificar el artículo', error);
            Swal.fire('Error', 'No se pudo actualizar el artículo', 'error');
          }
        );
      }
    });
  }


  vaciarCarrito(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      Swal.fire('Error', 'No se puede vaciar el carrito, usuario no autenticado', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, vaciar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.vaciarCarrito(userId).subscribe(
          () => {
            Swal.fire('Éxito', 'El carrito ha sido vaciado', 'success');
            this.mostrarCarrito(); // Actualiza la lista del carrito después de vaciarlo
          },
          (error) => {
            console.error('Error al vaciar el carrito', error);
            Swal.fire('Error', 'No se pudo vaciar el carrito', 'error');
          }
        );
      }
    });
  }

   
  pagar(total: number) {
    this.paymentService.createOrder(total).subscribe(
      (response) => {
        // Redirige al usuario a PayPal para completar el pago
        window.location.href = response.links[1].href;
      },
      (error) => {
        console.error('Error al crear la orden de pago', error);
        Swal.fire('Error', 'No se pudo crear la orden de pago', 'error');
      }
    );
  }
  
}


