
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { CarouselModule } from 'primeng/carousel';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AddEditPlatillosComponent } from './components/administrador/add-edit-platillos/add-edit-platillos.component';
import { ListPlatillosComponent } from './components/administrador/list-platillos/list-platillos.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AddEditBebidasComponent } from './components/administrador/add-edit-bebidas/add-edit-bebidas.component';
import { ListBebidasComponent } from './components/administrador/list-bebidas/list-bebidas.component';
import { CarritoComponent } from './components/usuarios/carrito/carrito.component';
import { ListarPlatillosComponent } from './components/usuarios/listar-platillos/listar-platillos.component';
import { SobreNosotrosComponent } from './footer/sobre-nosotros/sobre-nosotros.component';
import { FaqsComponent } from './footer/faqs/faqs.component';
import { ContactoComponent } from './footer/contacto/contacto.component';
import { MapaSitioComponent } from './footer/mapa-sitio/mapa-sitio.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { PuntuacionComponent } from './components/usuarios/puntuacion/puntuacion.component';
import { ListarUsuariosComponent } from './components/administrador/listar-usuarios/listar-usuarios.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

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
    ListBebidasComponent,
    CarritoComponent,
    ListarPlatillosComponent,
    SobreNosotrosComponent,
    FaqsComponent,
    ContactoComponent,
    MapaSitioComponent,
    PuntuacionComponent,
    ListarUsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule,
    MenubarModule,
    MatButtonModule, // Añadir ReactiveFormsModule a la lista de imports
    SpeedDialModule,
    SplitButtonModule,
    CardModule,
    TableModule,
    CommonModule,
    TagModule,
    CarouselModule,
    FieldsetModule,
    PanelModule,
    DialogModule
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
