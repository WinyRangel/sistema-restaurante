import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../../services/payment.service';
import { PlatilloService } from '../../../services/platillo.service';
import { BebidaService } from '../../../services/bebida.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carritoItems: any[] = [];
  total: number = 0; 
  private carritoService: CarritoService;


  constructor(private http: HttpClient, private authService: AuthService, private paymentService: PaymentService, 
    private platilloService: PlatilloService, private bebidaService: BebidaService) {
    this.carritoService = CarritoService.getInstance(this.http);
   }

   ngOnInit(): void {
    this.mostrarCarrito();
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
  
    if (status === 'aceptado') {
      this.mostrarCarritoYGuardar(); // Nuevo método que maneja el flujo
    } else if (status === 'cancelado') {
      Swal.fire('Pago cancelado', 'El pago fue cancelado', 'info');
    }
  }
  
  mostrarCarritoYGuardar(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      Swal.fire('Error', 'No se puede mostrar el carrito, usuario no autenticado', 'error');
      return;
    }
  
    this.carritoService.mostrarCarrito(userId).subscribe(
      (data) => {
        this.carritoItems = data;
        this.calcularTotal();
        
        // Llama a saveCart después de calcular el total
        const tipoPagoId = 1;
        this.paymentService.saveCart(this.total, tipoPagoId).subscribe(
          (saveResponse) => {
            Swal.fire('Pago aceptado', 'El pago fue aceptado', 'success');
            console.log('Carrito guardado exitosamente', saveResponse);
            this.mostrarCarrito();
          },
          (saveError) => {
            console.error('Error al guardar el carrito', saveError);
            Swal.fire('Error', 'No se pudo guardar el carrito', 'error');
          }
        );
      },
      (error) => {
        console.error('Error al obtener el carrito', error);
        Swal.fire('Error', 'No se pudo cargar el carrito', 'error');
      }
    );
  }
  

  mostrarCarrito(): void {
    const userId = this.authService.getCarritoId();
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
    const item = this.carritoItems.find(item => item.itemCarritoId === itemCarritoId);
  
    if (!item) {
      Swal.fire('Error', 'Artículo no encontrado', 'error');
      return;
    }
  
    if (item.cantidad > 1) {
      // Si la cantidad es mayor a 1, solo actualiza la cantidad
      this.actualizarCantidad(item.itemCarritoId, item.cantidad - 1);
    } else {
      // Si la cantidad es 1, muestra la alerta para confirmar la eliminación
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
              Swal.fire('Éxito', 'El artículo ha sido eliminado', 'success');
              this.mostrarCarrito(); // Actualiza la lista del carrito después de la eliminación
            },
            (error) => {
              console.error('Error al eliminar el artículo', error);
              Swal.fire('Error', 'No se pudo eliminar el artículo', 'error');
            }
          );
        }
      });
    }
  }
  
  // eliminarArticulo(itemCarritoId: number): void {
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: "¡No podrás deshacer esta acción!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí, eliminar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.carritoService.eliminarArticulo(itemCarritoId).subscribe(
  //         () => {
  //           Swal.fire('Éxito', 'El artículo ha sido actualizado', 'success');
  //           this.mostrarCarrito(); // Actualiza la lista del carrito después de la modificación
  //         },
  //         (error) => {
  //           console.error('Error al modificar el artículo', error);
  //           Swal.fire('Error', 'No se pudo actualizar el artículo', 'error');
  //         }
  //       );
  //     }
  //   });
  // }


  vaciarCarrito(): void {
    const userId = this.authService.getCarritoId();
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
      cancelButtonText: 'Cancelar',
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
        // Llama a saveCart() para guardar los datos del carrito
      },
      (error) => {
        console.error('Error al crear la orden de pago', error);
        Swal.fire('Error', 'No se pudo crear la orden de pago', 'error');
      }
    );
  }
  // pagar(total: number) {
  //   this.paymentService.createOrder(total).subscribe(
  //       (response) => {
  //           window.location.href = response.links[1].href;
  //       },
  //       (error) => {
  //           console.error('Error al crear la orden de pago', error);
  //           Swal.fire('Error', 'No se pudo crear la orden de pago', 'error');
  //       }
  //   );
  //   // Asumiendo que tienes un tipoPagoId seleccionado en tu componente
  //   const tipoPagoId = 1; // Por ejemplo, 1 para PayPal
  //   this.paymentService.saveCart(total, tipoPagoId).subscribe(
  //       (saveResponse) => {
  //           console.log('Carrito guardado exitosamente', saveResponse);
  //       },
  //       (saveError) => {
  //           console.error('Error al guardar el carrito', saveError);
  //           Swal.fire('Error', 'No se pudo guardar el carrito', 'error');
  //       }
  //   );
  // }


  actualizarCantidad(itemCarritoId: number, cantidad: number): void {
    this.carritoService.actualizarCantidadArticulo(itemCarritoId, cantidad).subscribe(
      response => {
        console.log('Cantidad actualizada:', response);
        this.mostrarCarrito();
      },
      error => {
        console.error('Error al actualizar la cantidad:', error);
      }
    );
  }
  
}


