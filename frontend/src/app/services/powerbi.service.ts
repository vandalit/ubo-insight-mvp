import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ===== INTERFACES =====
export interface PowerBIWorkspace {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredPermissions: string[];
  dashboards: PowerBIDashboard[];
}

export interface PowerBIDashboard {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  lastRefresh: string;
  kpis: PowerBIKPI[];
  charts?: PowerBIChart[];
}

export interface PowerBIKPI {
  name: string;
  value: string | number;
  trend: string;
  status: 'success' | 'warning' | 'danger' | 'info';
  icon: string;
}

export interface PowerBIChart {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'gauge';
  title: string;
  data: any;
}

export interface UserPermissions {
  workspaces: string[];
  permissions: string[];
  canAssignPermissions: boolean;
  canViewAllData: boolean;
}

export interface PowerBIData {
  metadata: {
    version: string;
    lastUpdated: string;
    refreshRate: string;
    dataSource: string;
    totalWorkspaces: number;
    totalDashboards: number;
    totalReports: number;
  };
  workspaces: PowerBIWorkspace[];
  userPermissions: Record<string, UserPermissions>;
  globalMetrics: any;
  recentAlerts: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PowerBIService {
  private powerBIData = signal<PowerBIData | null>(null);
  private isLoading = signal(false);
  private error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.loadPowerBIData();
  }

  // ===== GETTERS =====
  get data() { return this.powerBIData.asReadonly(); }
  get loading() { return this.isLoading.asReadonly(); }
  get errorMessage() { return this.error.asReadonly(); }

  // ===== LOAD DATA =====
  private loadPowerBIData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<PowerBIData>('/assets/data/powerbi.json')
      .pipe(
        catchError(error => {
          console.error('Error loading PowerBI data:', error);
          this.error.set('Error al cargar datos de Power BI');
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.powerBIData.set(data);
          console.log('✅ PowerBI data loaded successfully:', data.metadata);
        }
        this.isLoading.set(false);
      });
  }

  // ===== GET WORKSPACES FOR USER =====
  getWorkspacesForUser(userRole: string): PowerBIWorkspace[] {
    const data = this.powerBIData();
    if (!data) return [];

    const userPermissions = data.userPermissions[userRole];
    if (!userPermissions) {
      console.warn(`No permissions found for role: ${userRole}`);
      return [];
    }

    return data.workspaces.filter(workspace => 
      userPermissions.workspaces.includes(workspace.id)
    );
  }

  // ===== GET WORKSPACE BY ID =====
  getWorkspaceById(workspaceId: string): PowerBIWorkspace | null {
    const data = this.powerBIData();
    if (!data) return null;

    return data.workspaces.find(ws => ws.id === workspaceId) || null;
  }

  // ===== GET DASHBOARD BY ID =====
  getDashboardById(workspaceId: string, dashboardId: string): PowerBIDashboard | null {
    const workspace = this.getWorkspaceById(workspaceId);
    if (!workspace) return null;

    return workspace.dashboards.find(dash => dash.id === dashboardId) || null;
  }

  // ===== CHECK USER PERMISSIONS =====
  hasPermission(userRole: string, permission: string): boolean {
    const data = this.powerBIData();
    if (!data) return false;

    const userPermissions = data.userPermissions[userRole];
    if (!userPermissions) return false;

    return userPermissions.permissions.includes(permission);
  }

  // ===== GET USER PERMISSIONS =====
  getUserPermissions(userRole: string): UserPermissions | null {
    const data = this.powerBIData();
    if (!data) return null;

    return data.userPermissions[userRole] || null;
  }

  // ===== GET GLOBAL METRICS =====
  getGlobalMetrics(): any {
    const data = this.powerBIData();
    return data?.globalMetrics || {};
  }

  // ===== GET RECENT ALERTS =====
  getRecentAlerts(limit: number = 5): any[] {
    const data = this.powerBIData();
    if (!data) return [];

    return data.recentAlerts.slice(0, limit);
  }

  // ===== SIMULATE API CALLS =====
  
  // Simulate Power BI embed token generation
  generateEmbedToken(dashboardId: string): Observable<{token: string, expiry: string}> {
    // Simulate API delay
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          token: `mock_token_${dashboardId}_${Date.now()}`,
          expiry: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
        });
        observer.complete();
      }, 500);
    });
  }

  // Simulate data refresh
  refreshWorkspaceData(workspaceId: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        console.log(`🔄 Refreshing data for workspace: ${workspaceId}`);
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  // ===== PERMISSION MANAGEMENT =====
  
  // Simulate assigning permissions (for project managers)
  assignUserPermissions(userId: string, workspaceId: string, permissions: string[]): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        console.log(`👤 Assigning permissions to user ${userId} for workspace ${workspaceId}:`, permissions);
        observer.next(true);
        observer.complete();
      }, 800);
    });
  }

  // Get available permissions for assignment
  getAvailablePermissions(): string[] {
    return [
      'soc_access',
      'vuln_access', 
      'incident_access',
      'compliance_access',
      'risk_access',
      'admin_access'
    ];
  }

  // ===== ANALYTICS =====
  
  // Get workspace usage analytics
  getWorkspaceAnalytics(workspaceId: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          totalViews: Math.floor(Math.random() * 1000) + 100,
          uniqueUsers: Math.floor(Math.random() * 50) + 10,
          avgSessionDuration: `${Math.floor(Math.random() * 20) + 5} min`,
          lastAccessed: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          popularDashboards: ['dash-soc-realtime', 'dash-vuln-overview']
        });
        observer.complete();
      }, 600);
    });
  }

  // ===== UTILITY METHODS =====
  
  // Format KPI value for display
  formatKPIValue(kpi: PowerBIKPI): string {
    if (typeof kpi.value === 'number') {
      if (kpi.value > 1000) {
        return `${(kpi.value / 1000).toFixed(1)}K`;
      }
      return kpi.value.toString();
    }
    return kpi.value;
  }

  // Get status color for KPI
  getKPIStatusColor(status: string): string {
    const colors = {
      success: '#10b981',
      warning: '#f59e0b', 
      danger: '#dc2626',
      info: '#3b82f6'
    };
    return colors[status as keyof typeof colors] || colors.info;
  }

  // Check if data needs refresh
  needsRefresh(): boolean {
    const data = this.powerBIData();
    if (!data) return true;

    const lastUpdated = new Date(data.metadata.lastUpdated);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdated.getTime()) / (1000 * 60);
    
    // Refresh if data is older than 15 minutes
    return diffMinutes > 15;
  }

  // Force reload data
  reloadData(): void {
    this.loadPowerBIData();
  }
}
