import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from '../../shared/grid/grid';
import { DetailViewComponent, DetailItem } from '../../shared/detail-view';
import { DataService, ServiceItem } from '../../services/data';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, GridComponent, DetailViewComponent],
  templateUrl: './servicios.html',
  // Styles handled by global SCSS system
})
export class ServiciosComponent implements OnInit {
  servicios: ServiceItem[] = [];
  isDetailView = false;
  currentDetailIndex = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadServicios();
  }

  loadServicios() {
    this.dataService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        console.log('Servicios cargados:', servicios);
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
      }
    });
  }

  get detailItems(): DetailItem[] {
    return this.servicios.map(servicio => ({
      id: servicio.id,
      title: servicio.title,
      image: servicio.image,
      description: servicio.description,
      details: servicio.details,
      hasButton: servicio.hasButton,
      buttonText: servicio.buttonText,
      buttonAction: servicio.buttonAction
    }));
  }

  onCardClick(item: ServiceItem) {
    const index = this.servicios.findIndex(s => s.id === item.id);
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
      // Redirigir al login real
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
