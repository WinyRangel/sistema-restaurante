import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-puntuacion', 
  templateUrl: './puntuacion.component.html',
  styleUrls: ['./puntuacion.component.css']
})
export class PuntuacionComponent {

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

  @Input() rating: number = 0; 
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  rate(value: number): void {
    this.rating = value;
    this.ratingChange.emit(this.rating);
  }
}
