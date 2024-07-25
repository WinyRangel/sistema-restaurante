import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carritoItems: any[] = [];
  total: number = 0; 

  constructor(private carritoService: CarritoService, private authService: AuthService) { }

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


}


