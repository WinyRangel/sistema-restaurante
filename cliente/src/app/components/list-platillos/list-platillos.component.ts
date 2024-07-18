import { Component, OnInit } from '@angular/core';
import { PlatilloService } from '../../services/platillo.service';
import { Platillo } from '../../interfaces/Platillo';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-platillos',
  templateUrl: './list-platillos.component.html',
  styleUrl: './list-platillos.component.css'
})
export class ListPlatillosComponent {

  listPlatillos: Platillo[] = [];

  constructor(private _platilloService: PlatilloService, private router: Router){}

  ngOnInit(): void {
    this.getListPlatillos()
  }

  getListPlatillos(){
    this._platilloService.getPlatillos().subscribe((data) => {
      this.listPlatillos = data; //ahora listProducts es lo que llega de data
    })
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
          this.getListPlatillos(); // Actualizar la lista de platillos después de eliminar :O
        });
      }
    });
  }

  editPlatillo(id: number) {
    this.router.navigate(['edit-platillo/', id]);
  }

}
