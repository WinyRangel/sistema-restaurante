import { Component } from '@angular/core';
import { ItemCarrito } from '../../../Interfaces/ItemCarrito';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  listaItemsCarrito: ItemCarrito[] | undefined;

  ngOnInit(): void{
    let carritoStorage = localStorage.getItem("carrito") as string;
    let carrito = JSON.parse(carritoStorage);
    this.listaItemsCarrito = carrito;
  }

  vaciarCarrito() {
    localStorage.removeItem("carrito");
    this.listaItemsCarrito = []; // Actualiza la vista

  }
  

}
