import { Component, OnInit, OnDestroy, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { AuthService, User } from '../../services/auth.service';
import { NavbarInsightComponent } from '../shared/navbar-insight/navbar-insight.component';
import { DashboardFooterComponent } from '../dashboard-footer/dashboard-footer.component';
import { ModuleNavComponent, ModuleNavItem } from '../shared/module-nav/module-nav.component';

// Registrar Chart.js components
Chart.register(...registerables);

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress_percentage: number;
  start_date: string;
  end_date: string;
  owner_name: string;
  team_count: number;
  task_count: {
    open: number;
    closed: number;
    total: number;
  };
  budget_value: string;
  category: string;
  tags: string[];
  on_schedule: boolean;
}

interface ProjectMetrics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_tasks: number;
  completed_tasks: number;
  team_members: number;
  total_budget: string;
  on_time_percentage: number;
}

@Component({
  selector: 'app-projects-dashboard',
  imports: [CommonModule, NavbarInsightComponent, DashboardFooterComponent, ModuleNavComponent],
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Signals para estado reactivo
  currentUser = signal<User | null>(null);
  projects = signal<Project[]>([]);
  filteredProjects = signal<Project[]>([]);
  metrics = signal<ProjectMetrics | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  // Filtros
  selectedStatus = signal<string>('all');
  selectedPriority = signal<string>('all');
  searchTerm = signal<string>('');
  
  // Charts
  @ViewChild('progressChart', { static: false }) progressChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart', { static: false }) statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('budgetChart', { static: false }) budgetChartRef!: ElementRef<HTMLCanvasElement>;
  
  private progressChart: Chart | null = null;
  private statusChart: Chart | null = null;
  private budgetChart: Chart | null = null;

  // Navegación del módulo
  moduleNavItems: ModuleNavItem[] = [
    {
      id: 'overview',
      label: 'Resumen',
      route: '/modules/proyectos/overview',
      icon: '📊'
    },
    {
      id: 'projects',
      label: 'Proyectos',
      route: '/modules/proyectos/projects',
      icon: '📁'
    },
    {
      id: 'tasks',
      label: 'Tareas',
      route: '/modules/proyectos/tasks',
      icon: '✅'
    },
    {
      id: 'team',
      label: 'Equipo',
      route: '/modules/proyectos/team',
      icon: '👥'
    },
    {
      id: 'reports',
      label: 'Reportes',
      route: '/modules/proyectos/reports',
      icon: '📈'
    },
    {
      id: 'settings',
      label: 'Configuración',
      route: '/modules/proyectos/settings',
      icon: '⚙️'
    }
  ];

  // Computed properties
  statusOptions = computed(() => [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activos' },
    { value: 'completed', label: 'Completados' },
    { value: 'on_hold', label: 'En pausa' }
  ]);

  priorityOptions = computed(() => [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ]);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadProjectsData();
    this.setupFilters();
  }

  ngAfterViewInit(): void {
    // Delay para asegurar que los elementos estén en el DOM
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private loadUserData(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser.set(user);
  }

  private async loadProjectsData(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // Simular carga de datos de Zoho Projects API
      const response = await this.simulateZohoProjectsAPI();
      
      this.projects.set(response.projects);
      this.metrics.set(response.metrics);
      this.applyFilters();
      
    } catch (error) {
      console.error('Error loading projects data:', error);
      this.error.set('Error al cargar los datos de proyectos');
      this.loadFallbackData();
    } finally {
      this.isLoading.set(false);
    }
  }

  private async simulateZohoProjectsAPI(): Promise<{ projects: Project[], metrics: ProjectMetrics }> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // En producción, esto sería una llamada real a la API de Zoho
    const mockProjects: Project[] = [
      {
        id: '170876000001789001',
        name: 'Sistema de Gestión Académica UBO',
        description: 'Modernización del sistema de gestión académica para mejorar la experiencia de estudiantes y docentes',
        status: 'active',
        priority: 'high',
        progress_percentage: 45,
        start_date: '2024-01-15',
        end_date: '2024-06-30',
        owner_name: 'Carlos Mendoza',
        team_count: 8,
        task_count: { open: 18, closed: 12, total: 30 },
        budget_value: '150000',
        category: 'Desarrollo de Software',
        tags: ['académico', 'estudiantes', 'modernización'],
        on_schedule: true
      },
      {
        id: '170876000001789002',
        name: 'Plataforma de E-Learning UBO',
        description: 'Desarrollo de plataforma propia de e-learning para cursos online y híbridos',
        status: 'active',
        priority: 'high',
        progress_percentage: 62,
        start_date: '2024-02-01',
        end_date: '2024-08-15',
        owner_name: 'Ana Rodriguez',
        team_count: 10,
        task_count: { open: 15, closed: 20, total: 35 },
        budget_value: '200000',
        category: 'Plataforma Educativa',
        tags: ['e-learning', 'educación', 'online'],
        on_schedule: true
      },
      {
        id: '170876000001789003',
        name: 'Infraestructura Cloud UBO',
        description: 'Migración de servicios críticos a infraestructura cloud y modernización de sistemas',
        status: 'active',
        priority: 'medium',
        progress_percentage: 28,
        start_date: '2024-03-01',
        end_date: '2024-12-31',
        owner_name: 'Roberto Silva',
        team_count: 6,
        task_count: { open: 22, closed: 8, total: 30 },
        budget_value: '300000',
        category: 'Infraestructura',
        tags: ['cloud', 'migración', 'aws'],
        on_schedule: false
      }
    ];

    const mockMetrics: ProjectMetrics = {
      total_projects: 3,
      active_projects: 3,
      completed_projects: 0,
      total_tasks: 95,
      completed_tasks: 40,
      team_members: 24,
      total_budget: '650000',
      on_time_percentage: 67
    };

    return { projects: mockProjects, metrics: mockMetrics };
  }

  private loadFallbackData(): void {
    // Datos de respaldo en caso de error
    const fallbackProjects: Project[] = [
      {
        id: 'fallback-1',
        name: 'Proyecto de Ejemplo',
        description: 'Datos no disponibles - Modo sin conexión',
        status: 'active',
        priority: 'medium',
        progress_percentage: 0,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        owner_name: 'Usuario Demo',
        team_count: 0,
        task_count: { open: 0, closed: 0, total: 0 },
        budget_value: '0',
        category: 'Demo',
        tags: ['fallback'],
        on_schedule: true
      }
    ];

    const fallbackMetrics: ProjectMetrics = {
      total_projects: 1,
      active_projects: 1,
      completed_projects: 0,
      total_tasks: 0,
      completed_tasks: 0,
      team_members: 0,
      total_budget: '0',
      on_time_percentage: 0
    };

    this.projects.set(fallbackProjects);
    this.metrics.set(fallbackMetrics);
    this.applyFilters();
  }

  private setupFilters(): void {
    // Configurar efectos reactivos para filtros
    // En Angular 17+ usaríamos effect() aquí
  }

  private applyFilters(): void {
    let filtered = this.projects();
    
    // Filtrar por estado
    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(p => p.status === this.selectedStatus());
    }
    
    // Filtrar por prioridad
    if (this.selectedPriority() !== 'all') {
      filtered = filtered.filter(p => p.priority === this.selectedPriority());
    }
    
    // Filtrar por término de búsqueda
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.owner_name.toLowerCase().includes(term)
      );
    }
    
    this.filteredProjects.set(filtered);
  }

  // Métodos de filtrado
  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
    this.applyFilters();
  }

  onPriorityChange(priority: string): void {
    this.selectedPriority.set(priority);
    this.applyFilters();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.applyFilters();
  }

  // Métodos de navegación
  viewProject(projectId: string): void {
    this.router.navigate(['/modules/proyectos/project', projectId]);
  }

  createProject(): void {
    this.router.navigate(['/modules/proyectos/create']);
  }

  // Métodos de utilidad
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'on_hold': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // Métodos de gráficos
  private initializeCharts(): void {
    this.createProgressChart();
    this.createStatusChart();
    this.createBudgetChart();
  }

  private createProgressChart(): void {
    if (!this.progressChartRef?.nativeElement) return;

    const ctx = this.progressChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const projects = this.projects();
    const data = projects.map(p => p.progress_percentage);
    const labels = projects.map(p => p.name);

    this.progressChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Progreso (%)',
          data: data,
          backgroundColor: '#0d2c5b',
          borderColor: '#0d2c5b',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  private createStatusChart(): void {
    if (!this.statusChartRef?.nativeElement) return;

    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const metrics = this.metrics();
    if (!metrics) return;

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'Completados', 'En Pausa'],
        datasets: [{
          data: [metrics.active_projects, metrics.completed_projects, 0],
          backgroundColor: ['#0d2c5b', '#f39c12', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  private createBudgetChart(): void {
    if (!this.budgetChartRef?.nativeElement) return;

    const ctx = this.budgetChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const projects = this.projects();
    const budgets = projects.map(p => parseInt(p.budget_value));
    const labels = projects.map(p => p.name);

    this.budgetChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: budgets,
          backgroundColor: ['#0d2c5b', '#f39c12', '#28a745']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  private destroyCharts(): void {
    if (this.progressChart) {
      this.progressChart.destroy();
      this.progressChart = null;
    }
    if (this.statusChart) {
      this.statusChart.destroy();
      this.statusChart = null;
    }
    if (this.budgetChart) {
      this.budgetChart.destroy();
      this.budgetChart = null;
    }
  }

  refreshData(): void {
    this.loadProjectsData();
  }
}
