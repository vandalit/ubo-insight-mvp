import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card';
import { ServiceItem } from '../../services/data';

@Component({
  selector: 'app-grid',
  imports: [CommonModule, CardComponent],
  templateUrl: './grid.html',
  styleUrl: './grid.css'
})
export class GridComponent {
  @Input() items: ServiceItem[] = [];
  @Input() columns: number = 3;
  @Output() cardClick = new EventEmitter<ServiceItem>();
  @Output() buttonClick = new EventEmitter<ServiceItem>();

  onCardClick(item: ServiceItem) {
    this.cardClick.emit(item);
  }

  onButtonClick(item: ServiceItem) {
    this.buttonClick.emit(item);
  }

  get gridCols() {
    switch (this.columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  }
}
