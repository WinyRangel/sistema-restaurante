import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

//Inicio servicios
import { CargarScriptService } from './components/home/cargar-script.service';
//fin servicios

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ListPlatillosComponent } from './components/list-platillos/list-platillos.component';
import { AddEditPlatillosComponent } from './components/add-edit-platillos/add-edit-platillos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    IniciarSesionComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ListPlatillosComponent,
    AddEditPlatillosComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    CargarScriptService,
    provideClientHydration(
      
    ),
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
