import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, News } from '../../services/api.service';
import { SafeImageComponent } from '../shared/safe-image/safe-image.component';

@Component({
  selector: 'app-noticias',
  imports: [CommonModule, SafeImageComponent],
  templateUrl: './noticias.html',
  // Styles handled by global SCSS system
})
export class NoticiasComponent implements OnInit {
  allNoticias: News[] = [];
  displayedNoticias: News[] = [];
  heroNoticia: News | null = null;
  noticiasPerLoad = 3;
  currentLoadedCount = 0;
  isLoading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadNoticias();
  }

  loadNoticias() {
    console.log('🔍 [Noticias] Cargando noticias desde API...');
    this.isLoading = true;
    this.error = null;

    this.apiService.getNews().subscribe({
      next: (noticias) => {
        console.log('✅ [Noticias] Noticias cargadas desde base de datos:', noticias.length);
        this.allNoticias = noticias;
        
        // Primera noticia destacada como hero
        const featuredNews = noticias.find(n => n.is_featured);
        if (featuredNews) {
          this.heroNoticia = featuredNews;
          // Las demás noticias para la sección principal
          this.allNoticias = noticias.filter(n => !n.is_featured);
        } else if (noticias.length > 0) {
          // Si no hay destacada, usar la primera
          this.heroNoticia = noticias[0];
          this.allNoticias = noticias.slice(1);
        }
        
        // Cargar las primeras 3 noticias
        this.loadMoreNoticias();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [Noticias] Error cargando noticias:', error);
        this.error = 'Error al cargar las noticias. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  loadMoreNoticias() {
    const nextBatch = this.allNoticias.slice(
      this.currentLoadedCount, 
      this.currentLoadedCount + this.noticiasPerLoad
    );
    
    this.displayedNoticias = [...this.displayedNoticias, ...nextBatch];
    this.currentLoadedCount += nextBatch.length;
  }

  hasMoreNoticias(): boolean {
    return this.currentLoadedCount < this.allNoticias.length;
  }

  // Determinar si la noticia debe tener layout invertido (imagen a la derecha)
  isReversedLayout(index: number): boolean {
    return index % 2 === 1; // Intercalar: 0=izq, 1=der, 2=izq, 3=der...
  }
}
