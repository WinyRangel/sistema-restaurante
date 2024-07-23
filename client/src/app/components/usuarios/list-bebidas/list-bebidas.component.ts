import { Component, OnInit } from '@angular/core';
import { BebidaService } from '../../../services/bebida.service';
import { AuthService } from '../../../services/auth.service'; // Importa el AuthService
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Bebida } from '../../../Interfaces/Bebida';

@Component({
  selector: 'app-list-bebidas',
  templateUrl: './list-bebidas.component.html',
  styleUrls: ['./list-bebidas.component.css']
})
export class ListBebidasComponent implements OnInit {
  listBebidas: Bebida[] = [];

  constructor(private _bebidaService: BebidaService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getListBebidas();
  }

  getListBebidas() {
    this._bebidaService.getBebidas().subscribe((data) => {
      this.listBebidas = data;
    });
  }

  deleteBebida(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar esta bebida después de eliminarla!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._bebidaService.deleteBebida(id).subscribe(() => {
          Swal.fire(
            'Eliminada!',
            'La bebida ha sido eliminada.',
            'success'
          );
          this.getListBebidas();
        });
      }
    });
  }

  editBebida(id: number) {
    this.router.navigate(['edit-bebida/', id]);
  }

  agregarCarrito(bebidaId: number) {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire('Error', 'Debes iniciar sesión para agregar artículos al carrito', 'error');
      return;
    }
    
    const decodedToken = this.authService.parseJwt(token);
    const carritoId = decodedToken.carritoId; // Obtén el carritoId del token decodificado

    this._bebidaService.agregarCarrito({ carritoId, bebidaId, cantidad: 1 }).subscribe(() => {
      Swal.fire('¡Éxito!', 'Bebida agregada al carrito', 'success');
    }, (error) => {
      Swal.fire('Error', 'No se pudo agregar la bebida al carrito', 'error');
    });
  }
}
