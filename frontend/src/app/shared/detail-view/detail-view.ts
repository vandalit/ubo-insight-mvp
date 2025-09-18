import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DetailItem {
  id: number;
  title: string;
  image: string;
  description: string;
  details: string;
  hasButton: boolean;
  buttonText: string;
  buttonAction: string;
}

@Component({
  selector: 'app-detail-view',
  imports: [CommonModule],
  templateUrl: './detail-view.html',
  // Styles handled by global SCSS system
})
export class DetailViewComponent implements OnInit {
  @Input() items: DetailItem[] = [];
  @Input() selectedIndex: number = 0;
  @Output() closeDetail = new EventEmitter<void>();
  @Output() itemAction = new EventEmitter<{action: string, item: DetailItem}>();

  currentIndex: number = 0;

  ngOnInit() {
    this.currentIndex = this.selectedIndex;
  }

  // Navegación con arrow keys en el carrusel de cards
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Solo navegar si hay items cargados
    if (this.items && this.items.length > 1) {
      // Verificar que no estemos en un input o textarea
      const target = event.target as HTMLElement;
      const isInputElement = target.tagName === 'INPUT' || 
                           target.tagName === 'TEXTAREA' || 
                           target.contentEditable === 'true';
      
      if (!isInputElement) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            this.prevSlide();
            console.log('DetailView: Arrow Left - Previous card');
            break;
          case 'ArrowRight':
            event.preventDefault();
            this.nextSlide();
            console.log('DetailView: Arrow Right - Next card');
            break;
          case 'Escape':
            event.preventDefault();
            this.close();
            console.log('DetailView: Escape - Close detail view');
            break;
        }
      }
    }
  }

  get currentItem(): DetailItem | null {
    return this.items[this.currentIndex] || null;
  }

  close() {
    this.closeDetail.emit();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
  }

  onButtonClick() {
    if (this.currentItem && this.currentItem.hasButton) {
      this.itemAction.emit({
        action: this.currentItem.buttonAction,
        item: this.currentItem
      });
    }
  }

  isExternalLink(url: string): boolean {
    return /^https?:\/\//.test(url);
  }

  isWiFiService(): boolean {
    // Mostrar chip de WiFi solo si el título contiene "WiFi" o "Wi-Fi"
    return this.currentItem?.title.toLowerCase().includes('wifi') || 
           this.currentItem?.title.toLowerCase().includes('wi-fi') || false;
  }
}
