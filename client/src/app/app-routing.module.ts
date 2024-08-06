
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ListPlatillosComponent } from './components/usuarios/list-platillos/list-platillos.component';
import { AddEditPlatillosComponent } from './components/usuarios/add-edit-platillos/add-edit-platillos.component';
import { AddEditBebidasComponent } from './components/usuarios/add-edit-bebidas/add-edit-bebidas.component';
import { ListBebidasComponent } from './components/usuarios/list-bebidas/list-bebidas.component';
import { CarritoComponent } from './components/usuarios/carrito/carrito.component';
import { ContactoComponent } from './footer/contacto/contacto.component';
import { FaqsComponent } from './footer/faqs/faqs.component';
import { MapaSitioComponent } from './footer/mapa-sitio/mapa-sitio.component';
import { SobreNosotrosComponent } from './footer/sobre-nosotros/sobre-nosotros.component';
import { GestionUsuariosComponent } from './components/admin/gestion-usuarios/gestion-usuarios.component';

const routes: Routes = [

  { path: '', component: HomeComponent,  data: { breadcrumb: 'Inicio'}},
  { path: '', component: HomeComponent},
  { path: 'iniciar-sesion', component: IniciarSesionComponent},
  { path: 'inicio', component: HomeComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'platillos', component: ListPlatillosComponent},
  { path: 'añadir-platillo', component: AddEditPlatillosComponent },
  { path: 'edit-platillo/:id', component: AddEditPlatillosComponent },
  { path: 'bebidas', component: ListBebidasComponent},
  { path: 'añadir-bebida', component: AddEditBebidasComponent },
  { path: 'edit-bebida/:id', component: AddEditBebidasComponent },
  { path: 'carrito', component: CarritoComponent},
  { path: 'contacto', component: ContactoComponent},
  { path: 'faqs', component: FaqsComponent},
  { path: 'mapa-sitio', component: MapaSitioComponent},
  { path: 'sobre-nosotros', component: SobreNosotrosComponent},
  { path: 'lista-usuarios', component: GestionUsuariosComponent},
  { path: '**', redirectTo: 'error404'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }