import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListPlatillosComponent } from './components/list-platillos/list-platillos.component';
import { AddEditPlatillosComponent } from './components/add-edit-platillos/add-edit-platillos.component';

const routes: Routes = [
  { path: '', component: HomeComponent,  data: { breadcrumb: 'Inicio'}},
  { path: 'platillos', component: ListPlatillosComponent},
  { path: 'add', component: AddEditPlatillosComponent },
  { path: 'edit-platillo/:id', component: AddEditPlatillosComponent },
  { path: '**', redirectTo: 'error404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
