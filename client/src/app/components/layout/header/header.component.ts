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

  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion() {
    Swal.fire({
      title: "Regresa pronto!",
      text: "Porita Coffe te desea un excelente día"
    });
    this.authService.cerrarSesion();
    this.usuarioAutenticado = false;
    this.nombreUsuario = null;
    this.router.navigate(['/registro']);
  }

  estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

  ngOnInit(): void {
    this.usuarioAutenticado = this.authService.estaAutenticado();
    if (this.usuarioAutenticado) {
      this.nombreUsuario = this.authService.obtenerNombreUsuario();
    }

    // Suscríbete al listener de estado de autenticación
    this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.usuarioAutenticado = isAuthenticated;
      if (isAuthenticated) {
        this.nombreUsuario = this.authService.obtenerNombreUsuario();
      } else {
        this.nombreUsuario = null;
      }
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
