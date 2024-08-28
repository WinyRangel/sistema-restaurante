
import { Component, OnInit } from '@angular/core';
import { Platillo } from '../../Interfaces/Platillo';
import { PlatilloService } from '../../services/platillo.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { BebidaService } from '../../services/bebida.service';
import { Bebida } from '../../Interfaces/Bebida';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  listBebidas: Bebida[] = [];
  listPlatillos: Platillo[] = [];
  responsiveOptions: any[] | undefined;
  visible: boolean = false;



  constructor(private _platilloService: PlatilloService, 
    private authService: AuthService, 
    private router: Router, 
    private _bebidaService: BebidaService,
    private platilloService: PlatilloService,
    private cd: ChangeDetectorRef

  ) { }
  ngOnInit(): void {
    this.getListBebidas();
    this.getListPlatillos();

  }

  getListBebidas(){
    this._bebidaService.getBebidas().subscribe((data)=>{
        this.listBebidas = data;
        this.cd.detectChanges(); // Fuerza la detección de cambios
    });
  }

  getListPlatillos(){
    this._platilloService.getPlatillos().subscribe((data)=>{
        this.listPlatillos = data;
        this.cd.detectChanges(); // Fuerza la detección de cambios
    });
  }


  agregarCarritoBebida(bebidaId: number) {
    const carritoId = this.authService.getCarritoId();
    if (!carritoId) {
      Swal.fire('Error', 'Debes iniciar sesión para agregar artículos al carrito', 'error');
      return;
    }
    this._bebidaService.agregarCarrito({ carritoId, bebidaId, cantidad: 1 }).subscribe(() => {
      Swal.fire('¡Éxito!', 'Bebida agregada al carrito', 'success');
    }, (error) => {
      Swal.fire('Error', 'No se pudo agregar la bebida al carrito', 'error');
    });
  }

  agregarCarritoPlatillo(platilloId: number){
    const carritoId = this.authService.getCarritoId();
    if(!carritoId){
      Swal.fire('Error', 'Debes iniciar sesión para agregar artículos al carrito', 'error');
      return;
    }
    this.platilloService.agregarCarrito({ carritoId, platilloId, cantidad: 1 }).subscribe(() => {
      Swal.fire('¡Éxito!', 'Platillo agregado al carrito', 'success');
    }, (error) => {
      Swal.fire('Error', 'No se pudo agregar el platillo al carrito', 'error');
    });
  }


  showDialog() {
      this.visible = true;
  }
}
