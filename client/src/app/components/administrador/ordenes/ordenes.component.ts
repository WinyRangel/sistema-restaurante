import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';


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



}
