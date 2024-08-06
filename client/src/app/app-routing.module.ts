
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ListPlatillosComponent } from './components/administrador/list-platillos/list-platillos.component';
import { AddEditPlatillosComponent } from './components/administrador/add-edit-platillos/add-edit-platillos.component';
import { AddEditBebidasComponent } from './components/administrador/add-edit-bebidas/add-edit-bebidas.component';
import { ListBebidasComponent } from './components/administrador/list-bebidas/list-bebidas.component';
import { ListarPlatillosComponent } from './components/usuarios/listar-platillos/listar-platillos.component';
import { CarritoComponent } from './components/usuarios/carrito/carrito.component';

const routes: Routes = [

  { path: '', component: HomeComponent,  data: { breadcrumb: 'Inicio'}},
  { path: '', component: HomeComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'iniciar-sesion', component: IniciarSesionComponent},
  { path: 'inicio', component: HomeComponent},
  //Admin rutas
  { path: 'listar-platillos', component: ListPlatillosComponent},
  { path: 'añadir-platillo', component: AddEditPlatillosComponent },
  { path: 'edit-platillo/:id', component: AddEditPlatillosComponent },
  { path: 'bebidas', component: ListBebidasComponent},
  { path: 'añadir-bebida', component: AddEditBebidasComponent },
  { path: 'edit-bebida/:id', component: AddEditBebidasComponent },
  //usuario
  { path: 'ver-platillos', component: ListarPlatillosComponent },
  { path: 'carrito', component: CarritoComponent},
  { path: '**', redirectTo: 'error404'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }