import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, BulletinBoardItem } from '../../services/api.service';

@Component({
  selector: 'app-diario-mural',
  imports: [CommonModule],
  templateUrl: './diario-mural.html',
  // Styles handled by global SCSS system
})
export class DiarioMuralComponent implements OnInit {
  items: BulletinBoardItem[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDiarioMural();
  }

  loadDiarioMural() {
    console.log('🔍 [DiarioMural] Cargando avisos desde API...');
    this.isLoading = true;
    this.error = null;

    this.apiService.getBulletinBoard().subscribe({
      next: (items) => {
        console.log('✅ [DiarioMural] Avisos cargados desde base de datos:', items.length);
        this.items = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [DiarioMural] Error cargando avisos:', error);
        this.error = 'Error al cargar los avisos. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'urgente': return 'border-l-red-500 bg-red-50';
      case 'mantenimiento': return 'border-l-yellow-500 bg-yellow-50';
      case 'evento': return 'border-l-green-500 bg-green-50';
      case 'informativo': return 'border-l-blue-500 bg-blue-50';
      case 'recordatorio': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'urgente': return '🚨';
      case 'mantenimiento': return '🔧';
      case 'evento': return '📅';
      case 'informativo': return 'ℹ️';
      case 'recordatorio': return '⏰';
      default: return '📋';
    }
  }

  isUrgent(item: BulletinBoardItem): boolean {
    return item.is_urgent || item.type === 'urgente';
  }
}
