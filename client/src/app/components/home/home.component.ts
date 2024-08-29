
import { Component, OnInit } from '@angular/core';
import { PlatilloService } from '../../services/platillo.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { BebidaService } from '../../services/bebida.service';
import { Bebida } from '../../Interfaces/Bebida';
import { Platillo } from '../../interfaces/Platillo';
import { PuntuacionService } from '../../services/puntuacion.service';

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
    private cd: ChangeDetectorRef, private puntuacionService: PuntuacionService

  ) { }

  selectedPlatillo: Platillo | null = null;
  selectedBebida: Bebida | null = null;

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


  verDetallesPlatillo(platillo: Platillo) {
    this.selectedPlatillo = platillo;
    this.selectedBebida = null; // Limpiar cualquier bebida seleccionada
    this.showDialog();
}

verDetallesBebida(bebida: Bebida) {
    this.selectedBebida = bebida;
    this.selectedPlatillo = null; // Limpiar cualquier platillo seleccionado
    this.showDialog();
}

showDialog() {
    this.visible = true;
}



onRatingChange(platilloId: number, rating: number) {
  const usuarioId = this.authService.getUserId(); 

  const puntuacionData = {
    usuarioId,
    platilloId,
    puntuacion: rating,
    comentario: ''
  };

  this.puntuacionService.agregarPuntuacion(puntuacionData).subscribe(() => {
    Swal.fire('¡Éxito!', 'Puntuación guardada correctamente', 'success');
  }, (error) => {
    Swal.fire('Error', 'No se pudo guardar la puntuación', 'error');
  });
}

}
