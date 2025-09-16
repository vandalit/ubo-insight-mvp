import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from '../../shared/grid/grid';
import { ModalCarouselComponent } from '../../shared/modal-carousel/modal-carousel';
import { DataService, ServiceItem } from '../../services/data';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, GridComponent, ModalCarouselComponent],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css']
})
export class ServiciosComponent implements OnInit {
  servicios: ServiceItem[] = [];
  isModalOpen = false;
  currentModalIndex = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadServicios();
  }

  loadServicios() {
    this.dataService.getServicios().subscribe(servicios => {
      this.servicios = servicios;
    });
  }

  onCardClick(item: ServiceItem) {
    const index = this.servicios.findIndex(s => s.id === item.id);
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
      // Simular redirección a login
      console.log('Redirigiendo a login para:', item.title);
      alert('Funcionalidad de login será implementada próximamente');
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
