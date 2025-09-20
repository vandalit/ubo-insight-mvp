import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GridComponent } from '../../shared/grid/grid';
import { DetailViewComponent, DetailItem } from '../../shared/detail-view';
import { ApiService, ServiceItem } from '../../services/api.service';

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

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadServicios();
  }

  loadServicios() {
    this.apiService.getServices().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        console.log('✅ [SERVICIOS] Servicios cargados desde API:', servicios.length);
      },
      error: (error) => {
        console.error('❌ [SERVICIOS] Error cargando servicios desde API:', error);
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
    console.log('🎯 [ServiciosComponent] Recibido onDetailAction:', event);
    this.handleButtonAction(event.item as ServiceItem);
  }

  handleButtonAction(item: ServiceItem | DetailItem) {
    console.log('🎯 [ServiciosComponent] handleButtonAction:', item.buttonAction);
    
    if (item.buttonAction === 'login' || item.buttonAction === '/login') {
      console.log('✅ Redirigiendo a login con scroll al formulario para:', item.title);
      // Navegar al login con fragment para hacer scroll al formulario
      this.router.navigate(['/login'], { fragment: 'login-form' });
    } else if (item.buttonAction.startsWith('redirect:')) {
      const url = item.buttonAction.replace('redirect:', '');
      console.log('✅ Redirigiendo a:', url);
      window.open(url, '_blank');
    } else if (item.buttonAction.startsWith('mailto:') || item.buttonAction.includes('@')) {
      console.log('✅ Abriendo cliente de email:', item.buttonAction);
      const mailtoUrl = item.buttonAction.startsWith('mailto:') ? item.buttonAction : `mailto:${item.buttonAction}`;
      window.location.href = mailtoUrl;
    } else {
      console.warn('⚠️ Acción de botón no reconocida:', item.buttonAction);
    }
  }

  closeDetail() {
    this.isDetailView = false;
  }
}
