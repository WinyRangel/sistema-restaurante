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
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listBebidas: Bebida[] = [];
  listPlatillos: Platillo[] = [];
  responsiveOptions: any[] | undefined;
  visible: boolean = false;
  selectedPlatillo: Platillo | null = null;
  selectedBebida: Bebida | null = null;
  nuevoComentario: string = '';

  constructor(
    private _platilloService: PlatilloService,
    private authService: AuthService,
    private router: Router,
    private _bebidaService: BebidaService,
    private cd: ChangeDetectorRef,
    private puntuacionService: PuntuacionService
  ) {}

  ngOnInit(): void {
    this.getListBebidas();
    this.getListPlatillos();
  }

  getListBebidas() {
    this._bebidaService.getBebidas().subscribe((data) => {
      this.listBebidas = data;
      this.loadPuntuacionesBebidas(); // Cargar puntuaciones para las bebidas
      this.cd.detectChanges();
    });
  }

  getListPlatillos() {
    this._platilloService.getPlatillos().subscribe((data) => {
      this.listPlatillos = data;
      this.loadPuntuacionesPlatillos(); // Cargar puntuaciones para los platillos
      this.cd.detectChanges();
    });
  }

  loadPuntuacionesBebidas() {
    this.listBebidas.forEach(bebida => {
      this.puntuacionService.obtenerPuntuaciones(bebida.bebidaId).subscribe((puntuaciones: any[]) => {
        if (puntuaciones.length > 0) {
          bebida.rating = puntuaciones[0].puntuacion;
          bebida.comentarios = puntuaciones
            .filter(p => p.comentario && p.comentario.trim() !== '')//para que no se traiga los que no comentan
            .map(p => ({ usuarioNombre: p.usuarioNombre, comentario: p.comentario }));
        }
      });
    });
  }
  

  loadPuntuacionesPlatillos() {
    this.listPlatillos.forEach(platillo => {
      this.puntuacionService.obtenerPuntuaciones(undefined, platillo.platilloId).subscribe((puntuaciones: any[]) => {
        platillo.rating = puntuaciones.find(p => p.puntuacionId)?.puntuacion || 0;
        platillo.comentarios = puntuaciones
          .filter(p => p.comentario && p.comentario.trim() !== '')
          .map(p => ({ usuarioNombre: p.usuarioNombre, comentario: p.comentario }));
      });
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

  agregarCarritoPlatillo(platilloId: number) {
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
      Swal.fire({
        title: '¡Éxito!',
        text: 'Puntuación guardada correctamente',
        icon: 'success',
        customClass: {
          popup: 'swal2-custom'
        }
      });

      // Ajusta el z-index directamente después de mostrar la alerta
      const swalContainer = document.querySelector('.swal2-container') as HTMLElement;
      if (swalContainer) {
        swalContainer.style.zIndex = '2000';
      }

      // Actualiza la calificación del platillo en la lista
      this.updatePlatilloRating(platilloId, rating);
    }, (error) => {
      Swal.fire('Error', 'No se pudo guardar la puntuación', 'error');
    });
  }

  updatePlatilloRating(platilloId: number, rating: number) {
    const platillo = this.listPlatillos.find(p => p.platilloId === platilloId);
    if (platillo) {
      platillo.rating = rating;
      this.cd.detectChanges(); // Fuerza la detección de cambios para reflejar la actualización en la vista
    }
  }



  //BEBIDAS
  onRatingChangeBebida(bebidaId: number, rating: number) {
    const usuarioId = this.authService.getUserId();
    const puntuacionData = {
      usuarioId,
      bebidaId,
      puntuacion: rating,
      comentario: ''
    };

    this.puntuacionService.agregarPuntuacion(puntuacionData).subscribe(() => {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Puntuación guardada correctamente',
        icon: 'success',
        customClass: {
          popup: 'swal2-custom'
        }
      });

      // Ajusta el z-index directamente después de mostrar la alerta
      const swalContainer = document.querySelector('.swal2-container') as HTMLElement;
      if (swalContainer) {
        swalContainer.style.zIndex = '2000';
      }

      // Actualiza la calificación del platillo en la lista
      this.updateBebidaRating(bebidaId, rating);
    }, (error) => {
      Swal.fire('Error', 'No se pudo guardar la puntuación', 'error');
    });
  }

  updateBebidaRating(bebidaId: number, rating: number) {
    const bebida = this.listBebidas.find(b => b.bebidaId === bebidaId);
    if (bebida) {
      bebida.rating = rating;
      this.cd.detectChanges(); // Fuerza la detección de cambios para reflejar la actualización en la vista
    }
  }


  //COMENTARIO
  agregarComentario() {
    if (!this.nuevoComentario.trim()) {
      Swal.fire('Error', 'El comentario no puede estar vacío', 'error');
      return;
    }

    const usuarioId = this.authService.getUserId();
    const comentarioData = {
      usuarioId,
      bebidaId: this.selectedBebida ? this.selectedBebida.bebidaId : null,
      platilloId: this.selectedPlatillo ? this.selectedPlatillo.platilloId : null,
      puntuacion: this.selectedPlatillo ? this.selectedPlatillo.rating : this.selectedBebida ? this.selectedBebida.rating : 0,
      comentario: this.nuevoComentario
    };

    this.puntuacionService.agregarPuntuacion(comentarioData).subscribe(() => {
      this.nuevoComentario = ''; // Limpiar el campo de texto
      this.loadPuntuacionesPlatillos(); 
      this.loadPuntuacionesBebidas(); 
    }, (error) => {
      Swal.fire('Error', 'No se pudo agregar el comentario', 'error');
    });
  }

}
