import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ApiService } from '../../services/api.service';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  // Styles handled by global SCSS system
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('projectsChart', { static: false }) projectsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('servicesChart', { static: false }) servicesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('securityChart', { static: false }) securityChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('metricsChart', { static: false }) metricsChart!: ElementRef<HTMLCanvasElement>;

  // Dashboard data
  dashboardData = {
    projects: {
      active: 12,
      atRisk: 2,
      completed: 5,
      budget: { used: 2.4, total: 3.5 }
    },
    services: {
      uptime: 98.7,
      incidents: 3,
      slaCompliance: 94.2
    },
    security: {
      threatsBlocked: 247,
      failedLogins: 89,
      complianceScore: 96.8
    }
  };

  isLoading = true;
  error: string | null = null;

  private charts: Chart[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // Delay chart creation to ensure DOM is ready
    setTimeout(() => {
      this.createCharts();
      this.isLoading = false;
    }, 500);
  }

  loadDashboardData() {
    console.log(' Cargando datos del dashboard...');
    
    // Simular carga de datos (en el futuro será desde APIs reales)
    setTimeout(() => {
      console.log(' Datos del dashboard cargados');
    }, 1000);
  }

  createCharts() {
    this.createProjectsChart();
    this.createServicesChart();
    this.createSecurityChart();
    this.createMetricsChart();
  }

  private createProjectsChart() {
    const ctx = this.projectsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'En Riesgo', 'Completados'],
        datasets: [{
          data: [12, 2, 5],
          backgroundColor: ['#0d2c5b', '#f39c12', '#27ae60'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Estado de Proyectos',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createServicesChart() {
    const ctx = this.servicesChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Uptime %',
          data: [99.2, 98.8, 99.5, 97.2, 98.9, 99.1, 98.7],
          borderColor: '#0d2c5b',
          backgroundColor: 'rgba(13, 44, 91, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Disponibilidad de Servicios',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 95,
            max: 100
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createSecurityChart() {
    const ctx = this.securityChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Amenazas Bloqueadas', 'Logins Fallidos', 'Actualizaciones Pendientes'],
        datasets: [{
          label: 'Cantidad',
          data: [247, 89, 23],
          backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Indicadores de Seguridad (24h)',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createMetricsChart() {
    const ctx = this.metricsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'radar',
      data: {
        labels: ['Performance', 'Seguridad', 'Disponibilidad', 'Satisfacción', 'Eficiencia'],
        datasets: [{
          label: 'Actual',
          data: [85, 96, 98, 92, 88],
          borderColor: '#0d2c5b',
          backgroundColor: 'rgba(13, 44, 91, 0.2)',
          pointBackgroundColor: '#0d2c5b',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }, {
          label: 'Objetivo',
          data: [90, 95, 99, 95, 90],
          borderColor: '#f39c12',
          backgroundColor: 'rgba(243, 156, 18, 0.1)',
          pointBackgroundColor: '#f39c12',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'KPIs del Departamento TI',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  ngOnDestroy() {
    // Limpiar charts al destruir el componente
    this.charts.forEach(chart => chart.destroy());
  }
}
