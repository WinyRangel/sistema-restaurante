
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';


//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AddEditPlatillosComponent } from './components/usuarios/add-edit-platillos/add-edit-platillos.component';
import { ListPlatillosComponent } from './components/usuarios/list-platillos/list-platillos.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AddEditBebidasComponent } from './components/usuarios/add-edit-bebidas/add-edit-bebidas.component';
import { ListBebidasComponent } from './components/usuarios/list-bebidas/list-bebidas.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    IniciarSesionComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AddEditPlatillosComponent,
    ListPlatillosComponent,
    AddEditBebidasComponent,
    ListBebidasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule // Añadir ReactiveFormsModule a la lista de imports

  ],
  providers: [
  provideHttpClient(withFetch()),
  provideClientHydration(
      
    ),
  provideAnimationsAsync(),
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
