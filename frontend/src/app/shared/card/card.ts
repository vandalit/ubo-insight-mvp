import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceItem } from '../../services/data';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  // Styles handled by global SCSS system
})
export class CardComponent implements OnInit {
  @Input() item!: ServiceItem;
  @Output() cardClick = new EventEmitter<ServiceItem>();
  @Output() buttonClick = new EventEmitter<ServiceItem>();

  ngOnInit() {
    console.log('Card item:', this.item);
  }

  onCardClick() {
    this.cardClick.emit(this.item);
  }

  onButtonClick(event: Event) {
    event.stopPropagation();
    this.buttonClick.emit(this.item);
  }
}
