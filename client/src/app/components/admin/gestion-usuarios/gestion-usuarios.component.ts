import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent implements OnInit{

  usuarios: any[] = [];  // Arreglo para almacenar los usuarios

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this._authService.obtenerUsuarios().subscribe(
      response => {
        this.usuarios = response.usuarios;  // Almacena los usuarios obtenidos
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }


}
