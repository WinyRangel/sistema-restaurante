import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-puntuacion', 
  templateUrl: './puntuacion.component.html',
  styleUrls: ['./puntuacion.component.css']
})
export class PuntuacionComponent {
  @Input() rating: number = 0;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  rate(value: number): void {
    this.rating = value;
    this.ratingChange.emit(this.rating);
  }
}
