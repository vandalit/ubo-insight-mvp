import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, HomeSlide, HomeMetric } from '../../services/api.service';
import { LoadingSkeletonComponent } from '../../shared/loading-skeleton/loading-skeleton';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LoadingSkeletonComponent],
  templateUrl: './home.html',
  // Styles handled by global SCSS system
})
export class HomeComponent implements OnInit, OnDestroy {
  slides: HomeSlide[] = [];
  metrics: HomeMetric[] = [];
  currentSlide = 0;
  isLoadingSlides = true;
  isLoadingMetrics = true;
  private autoSlideInterval: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadSlides();
    this.loadMetrics();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  // Precargar imágenes para evitar layout shift
  private preloadImages(slides: HomeSlide[]): Promise<void> {
    if (!slides || slides.length === 0) {
      return Promise.resolve();
    }
    
    const imagePromises = slides.map(slide => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        
        // Timeout por imagen individual (3 segundos)
        const imgTimeout = setTimeout(() => {
          resolve(); // Continuar si la imagen toma demasiado
        }, 3000);
        
        img.onload = () => {
          clearTimeout(imgTimeout);
          resolve();
        };
        
        img.onerror = () => {
          clearTimeout(imgTimeout);
          resolve(); // Continuar aunque falle una imagen
        };
        
        img.src = slide.image_url;
      });
    });
    
    return Promise.all(imagePromises).then(() => {});
  }

  loadSlides() {
    this.isLoadingSlides = true;
    this.apiService.getHomeSlides().subscribe({
      next: (slides: HomeSlide[]) => {
        console.log('✅ [HOME] Slides loaded from API:', slides.length);
        this.slides = slides;
        
        // Fallback strategy: timeout de 8 segundos máximo
        const preloadTimeout = setTimeout(() => {
          console.log('Preload timeout - showing content anyway');
          this.isLoadingSlides = false;
        }, 8000);
        
        // Intentar precargar imágenes
        this.preloadImages(slides)
          .then(() => {
            clearTimeout(preloadTimeout);
            this.isLoadingSlides = false;
          })
          .catch(() => {
            // Si falla la precarga, mostrar contenido de todas formas
            clearTimeout(preloadTimeout);
            this.isLoadingSlides = false;
          });
      },
      error: (error: any) => {
        console.error('❌ [HOME] Error loading slides from API:', error);
        this.isLoadingSlides = false;
      }
    });
  }

  loadMetrics() {
    this.isLoadingMetrics = true;
    this.apiService.getHomeMetrics().subscribe({
      next: (metrics: HomeMetric[]) => {
        console.log('✅ [HOME] Metrics loaded from API:', metrics.length);
        this.metrics = metrics;
        this.isLoadingMetrics = false;
      },
      error: (error: any) => {
        console.error('❌ [HOME] Error loading metrics from API:', error);
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
  trackByMetricId(index: number, metric: HomeMetric): string {
    return metric.id;
  }
}
