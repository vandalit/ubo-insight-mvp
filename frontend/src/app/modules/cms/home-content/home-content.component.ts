import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

interface Metric {
  id: number;
  title: string;
  value: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home-content',
  imports: [CommonModule, FormsModule],
  templateUrl: './home-content.component.html',
  // Styles handled by global SCSS system
})
export class HomeContentComponent implements OnInit {
  slides = signal<Slide[]>([]);
  metrics = signal<Metric[]>([]);
  isLoading = signal(true);
  activeTab = signal<'slides' | 'metrics'>('slides');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    Promise.all([
      this.http.get<Slide[]>('assets/data/home-slides.json').toPromise(),
      this.http.get<Metric[]>('assets/data/home-metrics.json').toPromise()
    ]).then(([slides, metrics]) => {
      this.slides.set(slides || []);
      this.metrics.set(metrics || []);
      this.isLoading.set(false);
    }).catch(error => {
      console.error('Error loading data:', error);
      this.isLoading.set(false);
    });
  }

  goBack(): void {
    this.router.navigate(['/modules/cms']);
  }

  setActiveTab(tab: 'slides' | 'metrics'): void {
    this.activeTab.set(tab);
  }

  addSlide(): void {
    const newSlide: Slide = {
      id: Math.max(...this.slides().map(s => s.id), 0) + 1,
      title: 'Nuevo Slide',
      subtitle: 'Subtítulo',
      image: 'assets/images/placeholder.jpg',
      description: 'Descripción del slide'
    };
    this.slides.update(slides => [...slides, newSlide]);
  }

  removeSlide(id: number): void {
    this.slides.update(slides => slides.filter(s => s.id !== id));
  }

  addMetric(): void {
    const newMetric: Metric = {
      id: Math.max(...this.metrics().map(m => m.id), 0) + 1,
      title: 'Nueva Métrica',
      value: '0',
      icon: '📊',
      description: 'Descripción de la métrica'
    };
    this.metrics.update(metrics => [...metrics, newMetric]);
  }

  removeMetric(id: number): void {
    this.metrics.update(metrics => metrics.filter(m => m.id !== id));
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  saveChanges(): void {
    // En un entorno real, esto haría una llamada a la API
    console.log('Guardando cambios...');
    console.log('Slides:', this.slides());
    console.log('Metrics:', this.metrics());
    alert('Cambios guardados exitosamente (simulado)');
  }
}
