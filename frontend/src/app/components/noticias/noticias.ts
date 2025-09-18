import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Noticia } from '../../services/data';

@Component({
  selector: 'app-noticias',
  imports: [CommonModule],
  templateUrl: './noticias.html',
  // Styles handled by global SCSS system
})
export class NoticiasComponent implements OnInit {
  allNoticias: Noticia[] = [];
  displayedNoticias: Noticia[] = [];
  heroNoticia: Noticia | null = null;
  noticiasPerLoad = 3;
  currentLoadedCount = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadNoticias();
  }

  loadNoticias() {
    this.dataService.getNoticias().subscribe(noticias => {
      this.allNoticias = noticias;
      
      // Primera noticia como hero
      if (noticias.length > 0) {
        this.heroNoticia = noticias[0];
        // Las demás noticias para la sección principal
        this.allNoticias = noticias.slice(1);
      }
      
      // Cargar las primeras 3 noticias
      this.loadMoreNoticias();
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
