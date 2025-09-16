import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  featured: boolean;
}

@Component({
  selector: 'app-news-content',
  imports: [CommonModule, FormsModule],
  templateUrl: './news-content.component.html',
  styleUrls: ['./news-content.component.css']
})
export class NewsContentComponent implements OnInit {
  news = signal<NewsItem[]>([]);
  isLoading = signal(true);
  activeTab = signal<'list' | 'edit'>('list');
  editingNews = signal<NewsItem | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.http.get<NewsItem[]>('/assets/data/noticias.json').subscribe({
      next: (data) => {
        this.news.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.isLoading.set(false);
      }
    });
  }

  setActiveTab(tab: 'list' | 'edit'): void {
    this.activeTab.set(tab);
    if (tab === 'list') {
      this.editingNews.set(null);
    }
  }

  editNews(newsItem: NewsItem): void {
    this.editingNews.set({ ...newsItem });
    this.activeTab.set('edit');
  }

  addNewNews(): void {
    const newNews: NewsItem = {
      id: Math.max(...this.news().map(n => n.id), 0) + 1,
      title: 'Nueva Noticia',
      summary: 'Resumen de la noticia',
      content: 'Contenido completo de la noticia...',
      image: '/assets/images/default-news.jpg',
      category: 'General',
      date: new Date().toISOString().split('T')[0],
      author: 'Administrador',
      featured: false
    };
    this.editingNews.set(newNews);
    this.activeTab.set('edit');
  }

  saveNews(): void {
    const newsItem = this.editingNews();
    if (!newsItem) return;

    const currentNews = this.news();
    const existingIndex = currentNews.findIndex(n => n.id === newsItem.id);
    
    if (existingIndex >= 0) {
      // Update existing news
      const updatedNews = [...currentNews];
      updatedNews[existingIndex] = newsItem;
      this.news.set(updatedNews);
    } else {
      // Add new news
      this.news.set([...currentNews, newsItem]);
    }

    console.log('Guardando noticia:', newsItem);
    alert('Noticia guardada exitosamente (simulado)');
    this.setActiveTab('list');
  }

  deleteNews(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      this.news.update(news => news.filter(n => n.id !== id));
      console.log('Noticia eliminada:', id);
    }
  }

  toggleFeatured(newsItem: NewsItem): void {
    const updatedNews = this.news().map(n => 
      n.id === newsItem.id ? { ...n, featured: !n.featured } : n
    );
    this.news.set(updatedNews);
  }

  goBack(): void {
    this.router.navigate(['/modules/cms']);
  }

  trackByFn(index: number, item: NewsItem): number {
    return item.id;
  }
}
