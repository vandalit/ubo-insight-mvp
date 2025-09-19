import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Project } from '../../../services/api.service';

@Component({
  selector: 'app-proyectos-dashboard',
  imports: [CommonModule],
  template: `
    <div class="proyectos-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="container mx-auto px-6 py-8">
          <h1 class="text-3xl font-bold text-primary mb-2">Dashboard de Proyectos</h1>
          <p class="text-gray-600">Gestión y seguimiento de proyectos institucionales</p>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="container mx-auto px-6 py-8">
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          <span class="ml-4 text-gray-600">Cargando datos desde base de datos...</span>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="container mx-auto px-6 py-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error al cargar datos</h3>
              <p class="mt-1 text-sm text-red-700">{{ error }}</p>
              <button 
                (click)="loadData()" 
                class="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm transition-colors">
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!isLoading && !error" class="container mx-auto px-6 py-8">
        
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Proyectos</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats?.total_projects || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Proyectos Activos</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats?.active_projects || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Presupuesto Total</p>
                <p class="text-2xl font-bold text-gray-900">\${{ formatCurrency(stats?.budget_stats?.total_budget) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Progreso Promedio</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatPercentage(stats?.budget_stats?.avg_utilization) }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects List -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Lista de Proyectos</h2>
            <p class="text-sm text-gray-600">{{ projects.length }} proyectos encontrados</p>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let project of projects" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ project.name }}</div>
                      <div class="text-sm text-gray-500">{{ project.description | slice:0:60 }}...</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(project.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getStatusLabel(project.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          [style.width.%]="project.progress">
                        </div>
                      </div>
                      <span class="text-sm text-gray-600">{{ project.progress }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>\${{ formatCurrency(project.budget) }}</div>
                    <div class="text-xs text-gray-500">Gastado: \${{ formatCurrency(project.spent) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ project.manager?.name || 'Sin asignar' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getPriorityClass(project.priority)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getPriorityLabel(project.priority) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Debug Info -->
        <div class="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">🔍 Debug Info</h3>
          <div class="text-xs text-gray-600">
            <p>Datos cargados desde: <strong>PostgreSQL Database</strong></p>
            <p>Backend API: <strong>http://localhost:8000/api/v1</strong></p>
            <p>Última actualización: <strong>{{ lastUpdated | date:'medium' }}</strong></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .proyectos-dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .dashboard-header {
      background: linear-gradient(135deg, #0d2c5b 0%, #1a4480 100%);
      color: white;
    }
    
    .text-primary {
      color: #0d2c5b;
    }
    
    .text-secondary {
      color: #f39c12;
    }
    
    .border-secondary {
      border-color: #f39c12;
    }
  `]
})
export class ProyectosDashboardComponent implements OnInit {
  projects: Project[] = [];
  stats: any = null;
  isLoading = false;
  error: string | null = null;
  lastUpdated = new Date();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    console.log('🔍 [ProyectosDashboard] Cargando datos del dashboard...');
    this.isLoading = true;
    this.error = null;

    // Cargar proyectos y estadísticas en paralelo
    Promise.all([
      this.apiService.getProjects().toPromise(),
      this.apiService.getProjectStats().toPromise()
    ]).then(([projects, stats]) => {
      console.log('✅ [ProyectosDashboard] Datos cargados exitosamente');
      this.projects = projects || [];
      this.stats = stats;
      this.lastUpdated = new Date();
      this.isLoading = false;
    }).catch(error => {
      console.error('❌ [ProyectosDashboard] Error cargando datos:', error);
      this.error = 'Error al cargar los datos del dashboard. Verifica la conexión con el backend.';
      this.isLoading = false;
    });
  }

  getStatusClass(status: string): string {
    const classes = {
      'planning': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'on-hold': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'planning': 'Planificación',
      'in-progress': 'En Progreso',
      'completed': 'Completado',
      'on-hold': 'En Pausa'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getPriorityClass(priority: string): string {
    const classes = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return classes[priority as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getPriorityLabel(priority: string): string {
    const labels = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta'
    };
    return labels[priority as keyof typeof labels] || priority;
  }

  formatCurrency(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num || 0);
  }

  formatPercentage(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return (num || 0).toFixed(1);
  }
}
