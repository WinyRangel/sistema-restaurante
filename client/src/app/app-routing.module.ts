import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistroComponent } from './components/registro/registro.component';

const routes: Routes = [

  { path: '', component: HomeComponent,  data: { breadcrumb: 'Inicio'}},
  { path: '', component: HomeComponent},
  { path: 'iniciar-sesion', component: IniciarSesionComponent},
  { path: 'inicio', component: HomeComponent},
  { path: 'registro', component: RegistroComponent},
  { path: '**', redirectTo: 'error404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
