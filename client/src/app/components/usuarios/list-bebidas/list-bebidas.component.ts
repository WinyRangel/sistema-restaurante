import { Component } from '@angular/core';
import { BebidaService } from '../../../services/bebida.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Bebida } from '../../../Interfaces/Bebida';
import { ItemCarrito } from '../../../Interfaces/ItemCarrito';

@Component({
  selector: 'app-list-bebidas',
  templateUrl: './list-bebidas.component.html',
  styleUrls: ['./list-bebidas.component.css']
})
export class ListBebidasComponent {

  listBebidas: Bebida[] = [];

  constructor(private _bebidaService: BebidaService, private router: Router){}

  ngOnInit(): void {
    this.getListBebidas();
  }

  getListBebidas(){
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

  agregarCarrito(bebida: Bebida) {
    let iCarrito: ItemCarrito = {
      bebidaId: bebida.bebidaId,
      nombre: bebida.nombre,
      descripcion: bebida.descripcion,
      precio: bebida.precio,
      imagen: bebida.imagen, 
      cantidad: 1
    };

    this.actualizarCarrito(iCarrito, 'bebida');
  }

  private actualizarCarrito(item: ItemCarrito, tipo: 'platillo' | 'bebida') {
    let carritoStorage = localStorage.getItem("carrito") as string;
    let carrito: ItemCarrito[] = carritoStorage ? JSON.parse(carritoStorage) : [];

    let index = carrito.findIndex(i => i.platilloId === item.platilloId || i.bebidaId === item.bebidaId);

    if (index === -1) {
      carrito.push(item);
    } else {
      carrito[index].cantidad++;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    Swal.fire(
      'Agregado al carrito!',
      `La ${tipo} ha sido agregada`,
      'success'
    );
  }
}
