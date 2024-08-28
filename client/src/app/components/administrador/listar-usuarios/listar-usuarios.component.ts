import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Interfaces/Usuario';
import { AuthService } from '../../../services/auth.service';
import { error } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css',
})
export class ListarUsuariosComponent implements OnInit {
  listUsuarios: Usuario[] = [];
  
  constructor(private authService: AuthService){}
  
  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.authService.obtenerUsuarios().subscribe(
      (data: Usuario[]) => {
        console.log(data);
        this.listUsuarios = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  eliminarUsuario(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar este usuario después de eliminarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        this.authService.eliminarUsuario(id).subscribe(() => {
          Swal.fire({
            icon: "success",
            title: "El usuario ha sido eliminado.",
            showConfirmButton: false,
            timer: 1500
          });
          // Actualiza la lista de usuarios sin recargar la página
          this.listUsuarios = this.listUsuarios.filter(usuario => usuario._id !== id);
        });
      }
    });
  }

  getStatus(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    switch(status){
      case 'Activo':
        return 'success';
      case 'Semiactivo':
        return 'warning';
      case 'Inactivo':
        return 'danger';
      default:
        return undefined;  // O el valor que consideres adecuado
    }
  }
  
  
}