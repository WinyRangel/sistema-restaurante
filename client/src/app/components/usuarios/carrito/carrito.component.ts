import { Component, OnInit } from '@angular/core';
import { ItemCarrito } from '../../../Interfaces/ItemCarrito';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  listaItemsCarrito: ItemCarrito[] = [];
  total: number = 0;

  ngOnInit(): void {
    let carritoStorage = localStorage.getItem("carrito") as string;
    this.listaItemsCarrito = carritoStorage ? JSON.parse(carritoStorage) : [];
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.listaItemsCarrito.reduce((acc, item) => {
      return acc + (item.precio * item.cantidad);
    }, 0);
  }

  vaciarCarrito() {
    localStorage.removeItem("carrito");
    this.listaItemsCarrito = [];
    this.total = 0; // Actualiza el total también
  }
}
