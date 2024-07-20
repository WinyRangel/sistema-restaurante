import { Component } from '@angular/core';
import { BebidaService } from '../../../services/bebida.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Bebida } from '../../../Interfaces/Bebida';

@Component({
  selector: 'app-list-bebidas',
  templateUrl: './list-bebidas.component.html',
  styleUrl: './list-bebidas.component.css'
})
export class ListBebidasComponent {

  listBebidas: Bebida[] = [];

  constructor(private _bebidaService: BebidaService, private router: Router){}

  ngOnInit(): void {
    this.getListBebidas()
  }

  getListBebidas(){
    this._bebidaService.getBebidas().subscribe((data) => {
      this.listBebidas = data; //ahora listProducts es lo que llega de data
    })
  }


  deleteBebida(id: number) {
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
        this._bebidaService.deleteBebida(id).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'El platillo ha sido eliminado.',
            'success'
          );
          this.getListBebidas(); // Actualizar la lista de platillos después de eliminar :O
        });
      }
    });
  }

  editBebida(id: number) {
    this.router.navigate(['edit-bebida/', id]);
  }
}
