import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface DiarioMuralItem {
  id: number;
  title: string;
  content: string;
  type: 'aviso' | 'evento' | 'comunicado' | 'urgente';
  date: string;
  expiryDate?: string;
  author: string;
  priority: 'alta' | 'media' | 'baja';
  active: boolean;
}

@Component({
  selector: 'app-diario-mural-content',
  imports: [CommonModule, FormsModule],
  templateUrl: './diario-mural-content.component.html',
  // Styles handled by global SCSS system
})
export class DiarioMuralContentComponent implements OnInit {
  diarioItems = signal<DiarioMuralItem[]>([]);
  isLoading = signal(true);
  activeTab = signal<'list' | 'edit'>('list');
  editingItem = signal<DiarioMuralItem | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDiarioItems();
  }

  loadDiarioItems(): void {
    this.http.get<DiarioMuralItem[]>('/assets/data/diario-mural.json').subscribe({
      next: (data) => {
        this.diarioItems.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading diario mural items:', error);
        this.isLoading.set(false);
      }
    });
  }

  setActiveTab(tab: 'list' | 'edit'): void {
    this.activeTab.set(tab);
    if (tab === 'list') {
      this.editingItem.set(null);
    }
  }

  editItem(item: DiarioMuralItem): void {
    this.editingItem.set({ ...item });
    this.activeTab.set('edit');
  }

  addNewItem(): void {
    const newItem: DiarioMuralItem = {
      id: Math.max(...this.diarioItems().map(i => i.id), 0) + 1,
      title: 'Nuevo Aviso',
      content: 'Contenido del aviso...',
      type: 'aviso',
      date: new Date().toISOString().split('T')[0],
      author: 'Administrador',
      priority: 'media',
      active: true
    };
    this.editingItem.set(newItem);
    this.activeTab.set('edit');
  }

  saveItem(): void {
    const item = this.editingItem();
    if (!item) return;

    const currentItems = this.diarioItems();
    const existingIndex = currentItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Update existing item
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = item;
      this.diarioItems.set(updatedItems);
    } else {
      // Add new item
      this.diarioItems.set([...currentItems, item]);
    }

    console.log('Guardando item del diario mural:', item);
    alert('Item guardado exitosamente (simulado)');
    this.setActiveTab('list');
  }

  deleteItem(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este item?')) {
      this.diarioItems.update(items => items.filter(i => i.id !== id));
      console.log('Item eliminado:', id);
    }
  }

  toggleActive(item: DiarioMuralItem): void {
    const updatedItems = this.diarioItems().map(i => 
      i.id === item.id ? { ...i, active: !i.active } : i
    );
    this.diarioItems.set(updatedItems);
  }

  getTypeColor(type: string): string {
    const colors = {
      'aviso': 'bg-blue-100 text-blue-800',
      'evento': 'bg-green-100 text-green-800',
      'comunicado': 'bg-yellow-100 text-yellow-800',
      'urgente': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: string): string {
    const colors = {
      'alta': 'text-red-600',
      'media': 'text-yellow-600',
      'baja': 'text-green-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  }

  goBack(): void {
    this.router.navigate(['/modules/cms']);
  }

  trackByFn(index: number, item: DiarioMuralItem): number {
    return item.id;
  }
}
