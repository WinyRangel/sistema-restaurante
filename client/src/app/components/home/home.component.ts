
import { Component, OnInit } from '@angular/core';
import { Platillo } from '../../Interfaces/Platillo';
import { PlatilloService } from '../../services/platillo.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BebidaService } from '../../services/bebida.service';
import { Bebida } from '../../Interfaces/Bebida';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  listPlatillos: Platillo[] = [];
  listBebidas: Bebida[] = [];

  constructor(private _platilloService: PlatilloService, 
    private authService: AuthService, 
    private router: Router, 
    private _bebidaService: BebidaService
  ) { }
  ngOnInit(): void {
    this.getListPlatillos();
    this.getListBebidas();

  }

  getListBebidas(){
    this._bebidaService.getBebidas().subscribe((data)=>{
      this.listBebidas = data;
    })
  }

  getListPlatillos() {
    this._platilloService.getPlatillos().subscribe((data) => {
      this.listPlatillos = data;
    });
  }

  agregarCarrito(platilloId: number) {
    const carritoId = this.authService.getCarritoId();
    if (!carritoId) {
      Swal.fire('Error', 'Debes iniciar sesión para agregar artículos al carrito', 'error');
      return;
    }

    this._platilloService.agregarCarrito({ carritoId, platilloId, cantidad: 1 }).subscribe(() => {
      Swal.fire('¡Éxito!', 'Platillo agregado al carrito', 'success');
    }, (error) => {
      Swal.fire('Error', 'No se pudo agregar el platillo al carrito', 'error');
    });
  }
}
