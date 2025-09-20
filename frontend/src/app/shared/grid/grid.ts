import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card';
import { ServiceItem } from '../../services/api.service';

@Component({
  selector: 'app-grid',
  imports: [CommonModule, CardComponent],
  templateUrl: './grid.html',
  // Styles handled by global SCSS system
})
export class GridComponent implements OnInit {
  @Input() items: ServiceItem[] = [];
  @Input() columns: number = 3;
  @Output() cardClick = new EventEmitter<ServiceItem>();
  @Output() buttonClick = new EventEmitter<ServiceItem>();

  ngOnInit() {
    console.log('Grid items:', this.items);
    console.log('Grid columns:', this.columns);
  }

  onCardClick(item: ServiceItem) {
    this.cardClick.emit(item);
  }

  onButtonClick(item: ServiceItem) {
    this.buttonClick.emit(item);
  }

  trackByFn(index: number, item: ServiceItem): string {
    return item.id;
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
