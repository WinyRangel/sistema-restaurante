import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  usuarioAutenticado: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion() {
    Swal.fire({
      title: "Regresa pronto!",
      text: "Porita Coffe te desea un excelente día"
    });
    this.authService.cerrarSesion();
    this.router.navigate(['/registro']); // Redirige al usuario a la página de inicio de sesión
  }
  estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }
    ngOnInit(): void {
    this.usuarioAutenticado = this.authService.estaAutenticado();
  }
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
