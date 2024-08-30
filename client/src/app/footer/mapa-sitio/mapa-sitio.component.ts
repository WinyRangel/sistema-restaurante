import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-mapa-sitio',
  templateUrl: './mapa-sitio.component.html',
  styleUrl: './mapa-sitio.component.css'
})
export class MapaSitioComponent {
  data: TreeNode[] = [
    {
        label: 'Inicio',
        expanded: true,
        children: [
            {
                label: 'Bebidas'
            },
            {
                label: 'Platillos',
            },
            {
              label: 'Carrito'
            }
        ]
    }
];
}
