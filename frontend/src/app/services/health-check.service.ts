import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

export interface HealthStatus {
  isBackendAvailable: boolean;
  lastCheck: Date;
  apiEndpoints: {
    [key: string]: {
      status: 'healthy' | 'error' | 'unknown';
      lastResponse?: any;
      error?: string;
    }
  };
  systemInfo?: any;
}

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private baseUrl = 'http://localhost:8000';
  private healthStatus = signal<HealthStatus>({
    isBackendAvailable: false,
    lastCheck: new Date(),
    apiEndpoints: {}
  });

  private statusSubject = new BehaviorSubject<HealthStatus>(this.healthStatus());

  // Critical API endpoints to monitor
  private criticalEndpoints = [
    '/api/v1/home/slides',
    '/api/v1/home/metrics', 
    '/api/v1/services',
    '/api/v1/cybersecurity',
    '/api/v1/news',
    '/api/v1/bulletin-board'
  ];

  constructor(private http: HttpClient) {
    this.startHealthMonitoring();
  }

  get status$(): Observable<HealthStatus> {
    return this.statusSubject.asObservable();
  }

  get currentStatus(): HealthStatus {
    return this.healthStatus();
  }

  get isBackendHealthy(): boolean {
    return this.healthStatus().isBackendAvailable;
  }

  private startHealthMonitoring(): void {
    // Check immediately
    this.performHealthCheck();

    // Then check every 30 seconds
    timer(0, 30000).pipe(
      switchMap(() => this.performHealthCheck())
    ).subscribe();
  }

  private performHealthCheck(): Observable<HealthStatus> {
    console.log('🔍 [HealthCheck] Performing health check...');
    
    return this.http.get(`${this.baseUrl}/api/status`, {
      timeout: 5000,
      headers: { 'Accept': 'application/json' }
    }).pipe(
      map((response: any) => {
        console.log('✅ [HealthCheck] Backend is healthy');
        
        const status: HealthStatus = {
          isBackendAvailable: true,
          lastCheck: new Date(),
          apiEndpoints: {},
          systemInfo: response.data
        };

        // Test critical endpoints
        this.testCriticalEndpoints();

        this.updateStatus(status);
        return status;
      }),
      catchError((error) => {
        console.warn('⚠️ [HealthCheck] Backend not available:', error.message);
        
        const status: HealthStatus = {
          isBackendAvailable: false,
          lastCheck: new Date(),
          apiEndpoints: {}
        };

        this.updateStatus(status);
        return of(status);
      })
    );
  }

  private testCriticalEndpoints(): void {
    this.criticalEndpoints.forEach(endpoint => {
      this.http.get(`${this.baseUrl}${endpoint}`, { timeout: 3000 }).pipe(
        map(response => {
          this.updateEndpointStatus(endpoint, 'healthy', response);
        }),
        catchError(error => {
          this.updateEndpointStatus(endpoint, 'error', null, error.message);
          return of(null);
        })
      ).subscribe();
    });
  }

  private updateEndpointStatus(endpoint: string, status: 'healthy' | 'error', response?: any, error?: string): void {
    const currentStatus = this.healthStatus();
    currentStatus.apiEndpoints[endpoint] = {
      status,
      lastResponse: response,
      error
    };
    this.updateStatus(currentStatus);
  }

  private updateStatus(status: HealthStatus): void {
    this.healthStatus.set(status);
    this.statusSubject.next(status);
  }

  // Method to manually trigger health check
  checkHealth(): Observable<HealthStatus> {
    return this.performHealthCheck();
  }

  // Get fallback data for when backend is unavailable
  getFallbackData(dataType: string): any {
    const fallbackData: { [key: string]: any } = {
      'home-slides': [
        {
          id: 'fallback-1',
          title: 'UBO Insight MVP',
          subtitle: 'Modo Sin Conexión',
          description: 'El sistema está funcionando con datos de respaldo mientras se restablece la conexión con el servidor.',
          image: '/assets/images/fallback/ubo-placeholder.jpg',
          button_text: 'Reintentar Conexión',
          button_url: '#'
        }
      ],
      'home-metrics': [
        {
          id: 'fallback-metric-1',
          title: 'Sistema',
          subtitle: 'Estado',
          value: 'Offline',
          unit: '',
          icon: '⚠️',
          color: '#f39c12'
        },
        {
          id: 'fallback-metric-2', 
          title: 'Modo',
          subtitle: 'Operación',
          value: 'Fallback',
          unit: '',
          icon: '🔄',
          color: '#e74c3c'
        },
        {
          id: 'fallback-metric-3',
          title: 'Datos',
          subtitle: 'Disponibles',
          value: 'Limitados',
          unit: '',
          icon: '📊',
          color: '#95a5a6'
        }
      ],
      'services': [
        {
          id: 'fallback-service-1',
          title: 'Servicios Temporalmente No Disponibles',
          description: 'Los servicios digitales no están disponibles en este momento debido a problemas de conectividad.',
          details: 'Por favor, intente nuevamente en unos minutos o contacte al soporte técnico.',
          image: '/assets/images/fallback/service-placeholder.jpg',
          hasButton: true,
          buttonText: 'Reintentar',
          buttonAction: 'reload'
        }
      ],
      'news': [
        {
          id: 'fallback-news-1',
          title: 'Sistema en Modo de Respaldo',
          content: 'El sistema UBO Insight está funcionando con datos de respaldo mientras se restablece la conexión completa con los servidores.',
          excerpt: 'Información sobre el estado actual del sistema.',
          image_url: '/assets/images/fallback/news-placeholder.jpg',
          published_at: new Date().toISOString(),
          category: { name: 'Sistema', slug: 'sistema' },
          author: { name: 'Sistema UBO Insight' }
        }
      ]
    };

    return fallbackData[dataType] || [];
  }
}
