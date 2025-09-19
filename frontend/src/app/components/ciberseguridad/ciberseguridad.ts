import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from '../../shared/grid/grid';
import { DetailViewComponent, DetailItem } from '../../shared/detail-view';
import { ApiService, CybersecurityItem } from '../../services/api.service';

@Component({
  selector: 'app-ciberseguridad',
  imports: [CommonModule, GridComponent, DetailViewComponent],
  templateUrl: './ciberseguridad.html',
  // Styles handled by global SCSS system
})
export class CiberseguridadComponent implements OnInit {
  ciberseguridad: CybersecurityItem[] = [];
  isDetailView = false;
  currentDetailIndex = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCiberseguridad();
  }

  loadCiberseguridad() {
    this.apiService.getCybersecurity().subscribe({
      next: (items) => {
        this.ciberseguridad = items;
        console.log('✅ [CIBERSEGURIDAD] Items cargados desde API:', items.length);
      },
      error: (error) => {
        console.error('❌ [CIBERSEGURIDAD] Error cargando items desde API:', error);
      }
    });
  }

  get detailItems(): DetailItem[] {
    return this.ciberseguridad.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      description: item.description,
      details: item.details,
      hasButton: item.hasButton,
      buttonText: item.buttonText,
      buttonAction: item.buttonAction
    }));
  }

  onCardClick(item: CybersecurityItem) {
    const index = this.ciberseguridad.findIndex(s => s.id === item.id);
    this.currentDetailIndex = index;
    this.isDetailView = true;
  }

  onButtonClick(item: CybersecurityItem) {
    this.handleButtonAction(item);
  }

  onDetailAction(event: {action: string, item: DetailItem}) {
    this.handleButtonAction(event.item as CybersecurityItem);
  }

  handleButtonAction(item: CybersecurityItem | DetailItem) {
    if (item.buttonAction === 'login') {
      console.log('Redirigiendo a login para:', item.title);
      window.location.href = '/login';
    } else if (item.buttonAction.startsWith('redirect:')) {
      const url = item.buttonAction.replace('redirect:', '');
      console.log('Redirigiendo a:', url);
      alert(`Redirigiendo a: ${url}`);
    }
  }

  closeDetail() {
    this.isDetailView = false;
  }
}
