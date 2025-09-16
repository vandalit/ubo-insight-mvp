import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from '../../shared/grid/grid';
import { ModalCarouselComponent } from '../../shared/modal-carousel/modal-carousel';
import { DataService, ServiceItem } from '../../services/data';

@Component({
  selector: 'app-ciberseguridad',
  imports: [CommonModule, GridComponent, ModalCarouselComponent],
  templateUrl: './ciberseguridad.html',
  // Styles handled by global SCSS system
})
export class CiberseguridadComponent implements OnInit {
  ciberseguridad: ServiceItem[] = [];
  isModalOpen = false;
  currentModalIndex = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadCiberseguridad();
  }

  loadCiberseguridad() {
    this.dataService.getCiberseguridad().subscribe(items => {
      this.ciberseguridad = items;
    });
  }

  onCardClick(item: ServiceItem) {
    const index = this.ciberseguridad.findIndex(s => s.id === item.id);
    this.currentModalIndex = index;
    this.isModalOpen = true;
  }

  onButtonClick(item: ServiceItem) {
    this.handleButtonAction(item);
  }

  onModalButtonClick(item: ServiceItem) {
    this.handleButtonAction(item);
  }

  handleButtonAction(item: ServiceItem) {
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

  closeModal() {
    this.isModalOpen = false;
  }
}
