import { Component, OnInit } from '@angular/core';
import { PlatilloService } from '../../../services/platillo.service';
import { AuthService } from '../../../services/auth.service'; // Importa el AuthService
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Platillo } from '../../../interfaces/Platillo';

@Component({
  selector: 'app-list-platillos',
  templateUrl: './list-platillos.component.html',
  styleUrls: ['./list-platillos.component.css']
})
export class ListPlatillosComponent implements OnInit {
  listPlatillos: Platillo[] = [];

  constructor(private _platilloService: PlatilloService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getListPlatillos();
  }

  getListPlatillos() {
    this._platilloService.getPlatillos().subscribe((data) => {
      this.listPlatillos = data;
    });
  }

  deletePlatillo(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar este platillo después de eliminarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._platilloService.deletePlatillo(id).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'El platillo ha sido eliminado.',
            'success'
          );
          this.getListPlatillos();
        });
      }
    });
  }

  editPlatillo(id: number) {
    this.router.navigate(['edit-platillo/', id]);
  }

  agregarCarrito(platilloId: number) {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire('Error', 'Debes iniciar sesión para agregar artículos al carrito', 'error');
      return;
    }
    
    const decodedToken = this.authService.parseJwt(token);
    const carritoId = decodedToken.carritoId; // Obtén el carritoId del token decodificado

    this._platilloService.agregarCarrito({ carritoId, platilloId, cantidad: 1 }).subscribe(() => {
      Swal.fire('¡Éxito!', 'Platillo agregado al carrito', 'success');
    }, (error) => {
      Swal.fire('Error', 'No se pudo agregar el platillo al carrito', 'error');
    });
  }
}
