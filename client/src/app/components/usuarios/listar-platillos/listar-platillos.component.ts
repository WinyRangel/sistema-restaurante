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
  styleUrls: ['./listar-platillos.component.css']
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
    this.platilloService.getPlatillos().subscribe((data: Platillo[]) => {
      this.listPlatillos = data.map(platillo => ({ ...platillo, cantidad: 1 })); // Añadir cantidad inicial
    });
  }

  agregarCarrito(platillo: Platillo) {
    const userId = this.authService.getUserId();
    if (!userId) {
      Swal.fire('Error', 'Debes iniciar sesión para agregar artículos al carrito', 'error');
      return;
    }

    const itemCarrito: ItemCarrito = {
      platilloId: platillo.id, // Usar `platilloId` ya que `id` es la propiedad del `Platillo`
      nombre: platillo.nombre,
      descripcion: platillo.descripcion,
      precio: platillo.precio,
      imagen: platillo.imagen,
      cantidad: 0
    };

    const item = {
      userId,
      platilloId: platillo.platilloId ?? platillo.id, // Usa `platilloId` si está disponible, de lo contrario, `id`
      cantidad: (platillo as any).cantidad || 1 // Asegúrate de que `cantidad` esté definida
    };

    this.carritoService.agregarCarrito(item).subscribe(() => {
      Swal.fire('¡Éxito!', 'Platillo agregado al carrito', 'success');
    }, (error) => {
      Swal.fire('Error', 'No se pudo agregar el platillo al carrito', 'error');
    });
  }
}


