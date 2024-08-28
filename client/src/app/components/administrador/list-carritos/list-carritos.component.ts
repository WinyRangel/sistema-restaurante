import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Carrito } from '../../../Interfaces/Carrito';

@Component({
  selector: 'app-list-carritos',
  templateUrl: './list-carritos.component.html',
  styleUrls: ['./list-carritos.component.css']
})
export class ListCarritosComponent implements OnInit {
  listCarritos: Carrito[] = [];
  rol: string | null = null;
  usuarioAutenticado: boolean = false;

  constructor(
    private _carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioAutenticado = this.authService.estaAutenticado();
    if (this.usuarioAutenticado) {
      this.rol = this.authService.obtenerRol();
    }
    this.getListCarritos();
  }

  getListCarritos() {
    this._carritoService.getCarritos().subscribe((data) => {
      this.listCarritos = data;
    });
  }

  actualizarEstadoCarrito(carritoId: number, estado: string) {
    this._carritoService.actualizarEstado(carritoId, estado).subscribe(() => {
      Swal.fire('¡Éxito!', 'El estado del carrito ha sido actualizado.', 'success');
      this.getListCarritos();
    }, (error) => {
      Swal.fire('Error', 'No se pudo actualizar el estado del carrito.', 'error');
    });
  }
}
