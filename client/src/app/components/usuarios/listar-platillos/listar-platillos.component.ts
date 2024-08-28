import { Component, OnInit } from '@angular/core';
import { PlatilloService } from '../../../services/platillo.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Platillo } from '../../../Interfaces/Platillo';
import Swal from 'sweetalert2';
import { CarritoService } from '../../../services/carrito.service';
import { ItemCarrito } from '../../../Interfaces/ItemCarrito';

@Component({
  selector: 'app-listar-platillos',
  templateUrl: './listar-platillos.component.html',
  styleUrl: './listar-platillos.component.css'
})
export class ListarPlatillosComponent implements OnInit {
  listPlatillos: Platillo[] = [];

  constructor(
    private platilloService: PlatilloService,
    private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getListPlatillos();
  }

  getListPlatillos() {
    this.platilloService.getPlatillos().subscribe((data) => {
      this.listPlatillos = data.map(platillo => ({ ...platillo, cantidad: 1 })); // Añadir cantidad inicial
    });
  }

  incrementQuantity(ItemCarrito: ItemCarrito) {
    if (ItemCarrito.cantidad < 99) { // Evitar cantidades excesivas
      ItemCarrito.cantidad++;
    }
  }

  // decrementQuantity(platillo: Platillo) {
  //   if (platillo.cantidad > 1) {
  //     platillo.cantidad--;
  //   }
  // }

  // agregarCarrito(platillo: Platillo) {
  //   const userId = this.authService.getUserId();
  //   if (!userId) {
  //     Swal.fire('Error', 'Debes iniciar sesión para agregar artículos al carrito', 'error');
  //     return;
  //   }

  //   this.carritoService.agregarCarrito({
  //     userId,
  //     platilloId: platillo.id,
  //     cantidad: platillo.cantidad
  //   }).subscribe(() => {
  //     Swal.fire('¡Éxito!', 'Platillo agregado al carrito', 'success');
  //   }, (error) => {
  //     Swal.fire('Error', 'No se pudo agregar el platillo al carrito', 'error');
  //   });
  // }
}
