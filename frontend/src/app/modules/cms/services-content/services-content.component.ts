import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  button?: {
    text: string;
    action: string;
    route?: string;
  };
}

@Component({
  selector: 'app-services-content',
  imports: [CommonModule, FormsModule],
  templateUrl: './services-content.component.html',
  styleUrls: ['./services-content.component.css']
})
export class ServicesContentComponent implements OnInit {
  services = signal<Service[]>([]);
  isLoading = signal(true);
  activeTab = signal<'list' | 'edit'>('list');
  editingService = signal<Service | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.http.get<Service[]>('/assets/data/servicios.json').subscribe({
      next: (data) => {
        this.services.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading.set(false);
      }
    });
  }

  setActiveTab(tab: 'list' | 'edit'): void {
    this.activeTab.set(tab);
    if (tab === 'list') {
      this.editingService.set(null);
    }
  }

  editService(service: Service): void {
    this.editingService.set({ ...service });
    this.activeTab.set('edit');
  }

  addNewService(): void {
    const newService: Service = {
      id: Math.max(...this.services().map(s => s.id), 0) + 1,
      title: 'Nuevo Servicio',
      description: 'Descripción del servicio',
      image: '/assets/images/default-service.jpg',
      category: 'General',
      button: {
        text: 'Más información',
        action: 'modal'
      }
    };
    this.editingService.set(newService);
    this.activeTab.set('edit');
  }

  saveService(): void {
    const service = this.editingService();
    if (!service) return;

    const currentServices = this.services();
    const existingIndex = currentServices.findIndex(s => s.id === service.id);
    
    if (existingIndex >= 0) {
      // Update existing service
      const updatedServices = [...currentServices];
      updatedServices[existingIndex] = service;
      this.services.set(updatedServices);
    } else {
      // Add new service
      this.services.set([...currentServices, service]);
    }

    console.log('Guardando servicio:', service);
    alert('Servicio guardado exitosamente (simulado)');
    this.setActiveTab('list');
  }

  deleteService(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.services.update(services => services.filter(s => s.id !== id));
      console.log('Servicio eliminado:', id);
    }
  }

  goBack(): void {
    this.router.navigate(['/modules/cms']);
  }

  trackByFn(index: number, item: Service): number {
    return item.id;
  }
}
