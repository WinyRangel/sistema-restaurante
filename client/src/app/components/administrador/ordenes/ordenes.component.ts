import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css'
})
export class OrdenesComponent implements OnInit{

  constructor(private _carritoService: CarritoService){}

  ordenes: any[] = [];

  ngOnInit(): void {
    this.getListPlatillos();
  }

  getListPlatillos() {
    this._carritoService.obtenerOrdenes().subscribe((data) => {
      this.ordenes = data;
    });
  }



}
