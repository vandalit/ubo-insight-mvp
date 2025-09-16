import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceItem } from '../../services/data';

@Component({
  selector: 'app-modal-carousel',
  imports: [CommonModule],
  templateUrl: './modal-carousel.html',
  styleUrl: './modal-carousel.css'
})
export class ModalCarouselComponent {
  @Input() items: ServiceItem[] = [];
  @Input() currentIndex: number = 0;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<ServiceItem>();

  get currentItem(): ServiceItem | null {
    return this.items[this.currentIndex] || null;
  }

  closeModal() {
    this.close.emit();
  }

  nextItem() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prevItem() {
    this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
  }

  onButtonClick() {
    if (this.currentItem) {
      this.buttonClick.emit(this.currentItem);
    }
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
