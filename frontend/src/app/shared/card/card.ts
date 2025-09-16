import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceItem } from '../../services/data';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrls: ['./card.css']
})
export class CardComponent {
  @Input() item!: ServiceItem;
  @Output() cardClick = new EventEmitter<ServiceItem>();
  @Output() buttonClick = new EventEmitter<ServiceItem>();

  onCardClick() {
    this.cardClick.emit(this.item);
  }

  onButtonClick(event: Event) {
    event.stopPropagation();
    this.buttonClick.emit(this.item);
  }
}
