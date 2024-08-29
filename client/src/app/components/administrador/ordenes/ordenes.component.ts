import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css'
})
export class OrdenesComponent implements OnInit{

  constructor(private _carritoService: CarritoService, private authService: AuthService){}

  ordenes: any[] = [];
  usuarioAutenticado: boolean = false;
  nombreUsuario: string | null = null;
  rol: string | null = null;

  ngOnInit(): void {
    this.getListPlatillos();

    // Inicializa el estado de autenticación
    this.usuarioAutenticado = this.authService.estaAutenticado();
    if (this.usuarioAutenticado) {
      this.nombreUsuario = this.authService.obtenerNombreUsuario();
      this.rol = this.authService.obtenerRol();
    }

    // Suscríbete al listener de estado de autenticación
    this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.usuarioAutenticado = isAuthenticated;
      if (isAuthenticated) {
        this.nombreUsuario = this.authService.obtenerNombreUsuario();
        this.rol = this.authService.obtenerRol();
      } else {
        this.nombreUsuario = null;
        this.rol = null;
      }
    });
  }

  getListPlatillos() {
    this._carritoService.obtenerOrdenes().subscribe((data) => {
      this.ordenes = data;
    });
  }

  actualizarEstado(ordenId: number, nuevoEstado: string) {
    this._carritoService.actualizarEstadoOrden(ordenId, nuevoEstado).subscribe(
      response => {
        console.log('Estado actualizado:', response);
        Swal.fire({
          icon: 'success',
          title: 'Actualización Exitosa',
          text: 'El estado de la orden ha sido actualizado correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.getListPlatillos(); // Refresca la lista de órdenes
        });
      },
      error => {
        console.error('Error al actualizar el estado:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar el estado de la orden.',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

}
