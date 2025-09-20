import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GridComponent } from '../../shared/grid/grid';
import { DetailViewComponent, DetailItem } from '../../shared/detail-view';
import { ApiService, ServiceItem } from '../../services/api.service';

@Component({
  selector: 'app-ciberseguridad',
  imports: [CommonModule, GridComponent, DetailViewComponent],
  templateUrl: './ciberseguridad.html',
  // Styles handled by global SCSS system
})
export class CiberseguridadComponent implements OnInit {
  ciberseguridad: ServiceItem[] = [];
  isDetailView = false;
  currentDetailIndex = 0;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

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

  onCardClick(item: ServiceItem) {
    const index = this.ciberseguridad.findIndex(s => s.id === item.id);
    this.currentDetailIndex = index;
    this.isDetailView = true;
  }

  onButtonClick(item: ServiceItem) {
    this.handleButtonAction(item);
  }

  onDetailAction(event: {action: string, item: DetailItem}) {
    this.handleButtonAction(event.item as ServiceItem);
  }

  handleButtonAction(item: ServiceItem | DetailItem) {
    if (item.buttonAction === 'login') {
      console.log('Redirigiendo a login para:', item.title);
      this.router.navigate(['/login']);
    } else if (item.buttonAction.startsWith('redirect:')) {
      const url = item.buttonAction.replace('redirect:', '');
      console.log('Redirigiendo a:', url);
      window.open(url, '_blank');
    } else if (item.buttonAction.startsWith('mailto:')) {
      window.location.href = item.buttonAction;
    }
  }

  closeDetail() {
    this.isDetailView = false;
  }
}
