import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuarioAutenticado: boolean = false;
  nombreUsuario: string | null = null;
  rol: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
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

  cerrarSesion() {
    Swal.fire({
      title: "Regresa pronto!",
      text: "Porita Coffe te desea un excelente día"
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.cerrarSesion();
        this.router.navigate(['/iniciar-sesion']);
      }
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
