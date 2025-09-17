import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Slide, Metric } from '../../services/data';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  // Styles handled by global SCSS system
})
export class HomeComponent implements OnInit, OnDestroy {
  slides: Slide[] = [];
  metrics: Metric[] = [];
  currentSlide = 0;
  isLoadingMetrics = true;
  private autoSlideInterval: any = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadSlides();
    this.loadMetrics();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  loadSlides() {
    this.dataService.getHomeSlides().subscribe((slides: Slide[]) => {
      this.slides = slides;
    });
  }

  loadMetrics() {
    this.isLoadingMetrics = true;
    this.dataService.getHomeMetrics().subscribe({
      next: (metrics: Metric[]) => {
        this.metrics = metrics;
        this.isLoadingMetrics = false;
      },
      error: (error: any) => {
        console.error('Error loading metrics:', error);
        this.isLoadingMetrics = false;
      }
    });
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetAutoSlide();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambio automático cada 5 segundos
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // TrackBy function para optimizar el rendering de métricas
  trackByMetricId(index: number, metric: Metric): number {
    return metric.id;
  }
}
