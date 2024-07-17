import { Component, OnInit } from '@angular/core';
import { PlatilloService } from '../../services/platillo.service';
import { Platillo } from '../../interfaces/Platillo';

@Component({
  selector: 'app-list-platillos',
  templateUrl: './list-platillos.component.html',
  styleUrl: './list-platillos.component.css'
})
export class ListPlatillosComponent {

  listPlatillos: Platillo[] = [];

  constructor(private _platilloService: PlatilloService){}

  ngOnInit(): void {
    this.getListProducts()
  }

  getListProducts(){
    this._platilloService.getPlatillos().subscribe((data) => {
      this.listPlatillos = data; //ahora listProducts es lo que llega de data
    })
  }

}
