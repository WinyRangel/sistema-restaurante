import { Component, OnInit } from '@angular/core';
import { PlatilloService } from '../../../services/platillo.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Platillo } from '../../../interfaces/Platillo';
import { ItemCarrito } from '../../../Interfaces/ItemCarrito';


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

  agregarCarrito(platillo : Platillo){
    //console.log(platillo)
    let iCarrito: ItemCarrito = {//platillo k se esta agregando
      platilloId: platillo.platilloId,
      nombre: platillo.nombre,
      descripcion: platillo.descripcion,
      precio: platillo.precio,
      imagen: platillo.imagen, 
      cantidad: 1
    }
    if(localStorage.getItem("carrito") === null){
      let carrito: ItemCarrito[] = [];
      carrito.push(iCarrito);
      localStorage.setItem("carrito", JSON.stringify(carrito));//crear y almacenar
    }else{
      //leer contenido de carrio
      let carritoStorage = localStorage.getItem("carrito") as string;
      let carrito = JSON.parse(carritoStorage);

      //verificar los elementos del carro
      let index = -1;
      for(let i = 0; i<carrito.length; i++){
        let itemC: ItemCarrito = carrito[i];
        if(iCarrito.platilloId === itemC.platilloId){
          index=1;//captura la posicion del producto
          break; //que ya no busque el platillo
        }
      }

      if(index === -1){//si no encontro del platillo por id
        carrito.push(iCarrito);
        localStorage.setItem("carrito", JSON.stringify(carrito));//crear y almacenar
      }else{
        let itemCarrito: ItemCarrito = carrito[index];
        itemCarrito.cantidad++;//para incremente la cantidad
        carrito[index] = itemCarrito;
        localStorage.setItem("carrito", JSON.stringify(carrito));//crear y almacenar
      }

    }


    
    Swal.fire(
      'Agregado al carrito!',
      'El platillo ha sido agregado',
      'success'
    );
  }
  

}
