import { Component } from '@angular/core';
import { CargarScriptService } from './cargar-script.service'; { }
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private _cargarScripts: CargarScriptService){
    _cargarScripts.Cargar(["js/script.js"])

  }
}
