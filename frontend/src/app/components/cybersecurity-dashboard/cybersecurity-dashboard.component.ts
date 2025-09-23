import { Component, OnInit, OnDestroy, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { AuthService, User } from '../../services/auth.service';
import { PowerBIService, PowerBIWorkspace, PowerBIDashboard, PowerBIKPI } from '../../services/powerbi.service';
import { NavbarInsightComponent } from '../shared/navbar-insight/navbar-insight.component';
import { DashboardFooterComponent } from '../dashboard-footer/dashboard-footer.component';

// Registrar Chart.js components
Chart.register(...registerables);

interface TabItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  workspace: PowerBIWorkspace;
  accessible: boolean;
}

@Component({
  selector: 'app-cybersecurity-dashboard',
  imports: [CommonModule, NavbarInsightComponent, DashboardFooterComponent],
  templateUrl: './cybersecurity-dashboard.component.html',
  styleUrls: ['./cybersecurity-dashboard.component.scss']
})
export class CybersecurityDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Signals para estado reactivo
  currentUser = signal<User | null>(null);
  availableWorkspaces = signal<PowerBIWorkspace[]>([]);
  activeTabId = signal<string>('');
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  // Computed para tabs dinámicos
  tabs = computed<TabItem[]>(() => {
    const workspaces = this.availableWorkspaces();
    const user = this.currentUser();
    
    return workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      icon: workspace.icon,
      color: workspace.color,
      workspace: workspace,
      accessible: this.hasWorkspaceAccess(workspace, user)
    }));
  });

  // Computed para workspace activo
  activeWorkspace = computed(() => {
    const activeId = this.activeTabId();
    return this.availableWorkspaces().find(ws => ws.id === activeId) || null;
  });

  // Computed para dashboard activo
  activeDashboard = computed(() => {
    const workspace = this.activeWorkspace();
    return workspace?.dashboards[0] || null; // Por ahora tomar el primer dashboard
  });

  // ViewChild para canvas de gráficos
  @ViewChild('kpiChart', { static: false }) kpiChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendsChart', { static: false }) trendsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('distributionChart', { static: false }) distributionChartRef!: ElementRef<HTMLCanvasElement>;

  // Charts instances
  private charts: Chart[] = [];

  constructor(
    private authService: AuthService,
    private powerBIService: PowerBIService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngAfterViewInit(): void {
    // Esperar un tick para que los canvas estén disponibles
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  // ===== INITIALIZATION =====
  
  private async initializeComponent(): Promise<void> {
    try {
      this.isLoading.set(true);
      
      // Verificar autenticación
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.currentUser.set(user);

      // Verificar permisos de ciberseguridad
      if (!this.authService.hasPermission('ciberseguridad')) {
        this.error.set('No tienes permisos para acceder al dashboard de ciberseguridad');
        return;
      }

      // Cargar workspaces disponibles
      await this.loadAvailableWorkspaces();
      
      // Establecer tab activo inicial
      this.setInitialActiveTab();

      console.log('✅ Cybersecurity Dashboard initialized for user:', user.name);
      
    } catch (error) {
      console.error('❌ Error initializing cybersecurity dashboard:', error);
      this.error.set('Error al cargar el dashboard de ciberseguridad');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadAvailableWorkspaces(): Promise<void> {
    const user = this.currentUser();
    if (!user) return;

    const workspaces = this.powerBIService.getWorkspacesForUser(user.role);
    this.availableWorkspaces.set(workspaces);
    
    console.log(`📊 Loaded ${workspaces.length} workspaces for role: ${user.role}`);
  }

  private setInitialActiveTab(): void {
    const tabs = this.tabs();
    const accessibleTab = tabs.find(tab => tab.accessible);
    
    if (accessibleTab) {
      this.activeTabId.set(accessibleTab.id);
    } else if (tabs.length > 0) {
      this.activeTabId.set(tabs[0].id);
    }
  }

  // ===== TAB MANAGEMENT =====

  setActiveTab(tabId: string): void {
    this.activeTabId.set(tabId);
    this.loadWorkspaceData(tabId);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private loadWorkspaceData(workspaceId: string): void {
    // Simular carga de datos del workspace
    console.log(`Loading data for workspace: ${workspaceId}`);
    // Aquí se cargarían los datos específicos del workspace seleccionado
  }

  // ===== PERMISSIONS =====

  private hasWorkspaceAccess(workspace: PowerBIWorkspace, user: User | null): boolean {
    if (!user) return false;

    const userPermissions = this.powerBIService.getUserPermissions(user.role);
    if (!userPermissions) return false;

    return userPermissions.workspaces.includes(workspace.id);
  }

  canAssignPermissions(): boolean {
    return this.authService.canAssignPermissions();
  }

  getCybersecurityAccessLevel(): string {
    return this.authService.getCybersecurityAccessLevel();
  }

  // ===== CHART MANAGEMENT =====

  private initializeCharts(): void {
    const dashboard = this.activeDashboard();
    if (!dashboard || !dashboard.charts) return;

    // Limpiar gráficos existentes
    this.destroyCharts();

    // Crear gráficos según los datos del dashboard
    dashboard.charts.forEach((chartData, index) => {
      this.createChart(chartData, index);
    });
  }

  private createChart(chartData: any, index: number): void {
    let canvas: HTMLCanvasElement | null = null;

    // Seleccionar canvas según el índice
    switch (index) {
      case 0:
        canvas = this.kpiChartRef?.nativeElement;
        break;
      case 1:
        canvas = this.trendsChartRef?.nativeElement;
        break;
      case 2:
        canvas = this.distributionChartRef?.nativeElement;
        break;
    }

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: chartData.type as ChartType,
      data: chartData.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartData.title,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#0d2c5b'
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        },
        scales: chartData.type === 'line' || chartData.type === 'bar' ? {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        } : undefined
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => {
      chart.destroy();
    });
    this.charts = [];
  }

  // ===== UTILITY METHODS =====

  getKPIStatusClass(status: string): string {
    const classes = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      danger: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return classes[status as keyof typeof classes] || classes.info;
  }

  getKPIIcon(status: string): string {
    const icons = {
      success: '✅',
      warning: '⚠️',
      danger: '🚨',
      info: 'ℹ️'
    };
    return icons[status as keyof typeof icons] || icons.info;
  }

  formatKPIValue(kpi: PowerBIKPI): string {
    return this.powerBIService.formatKPIValue(kpi);
  }

  getTrendIcon(trend: string): string {
    if (trend.startsWith('+')) return '📈';
    if (trend.startsWith('-')) return '📉';
    return '➡️';
  }

  getTrendClass(trend: string): string {
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  }

  // ===== ACTIONS =====

  refreshData(): void {
    const workspace = this.activeWorkspace();
    if (!workspace) return;

    this.powerBIService.refreshWorkspaceData(workspace.id).subscribe({
      next: (success) => {
        if (success) {
          console.log('🔄 Data refreshed successfully');
          // Aquí podrías mostrar una notificación de éxito
        }
      },
      error: (error) => {
        console.error('❌ Error refreshing data:', error);
      }
    });
  }

  openPermissionsManager(): void {
    // TODO: Implementar modal de gestión de permisos
    console.log('🔐 Opening permissions manager...');
  }

  exportReport(): void {
    const workspace = this.activeWorkspace();
    console.log('📄 Exporting report for workspace:', workspace?.name);
    // TODO: Implementar exportación de reportes
  }
}
