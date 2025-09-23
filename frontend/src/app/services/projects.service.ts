import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';

// Interfaces para Zoho Projects API
export interface ZohoProject {
  id: string;
  id_string: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  start_date_long: number;
  end_date_long: number;
  created_date: string;
  updated_date: string;
  project_percent: number;
  budget_value: string;
  currency: string;
  owner_id: string;
  owner_name: string;
  role: string;
  is_public: string;
  is_strict: string;
  taskbug_prefix: string;
  bug_prefix: string;
  custom_status_id: string;
  layout_details: {
    task: { name: string; id: string };
    project: { name: string; id: string };
  };
  task_count: {
    open: number;
    closed: number;
    total: number;
  };
  milestone_count: {
    open: number;
    closed: number;
    total: number;
  };
  bug_count: {
    open: number;
    closed: number;
    total: number;
  };
  team_count: number;
  category: string;
  tags: string[];
  custom_fields: Record<string, any>;
  progress_metrics: {
    tasks_completed_this_week: number;
    hours_logged_this_week: number;
    budget_spent_percentage: number;
    on_schedule: boolean;
  };
}

export interface ZohoTask {
  id: string;
  id_string: string;
  project_id: string;
  project_name: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  start_date_long: number;
  end_date_long: number;
  created_date: string;
  updated_date: string;
  completed_date: string | null;
  percent_complete: number;
  estimated_hours: number;
  actual_hours: number;
  assignee: {
    id: string;
    name: string;
    email: string;
  };
  created_by: {
    id: string;
    name: string;
  };
  milestone_id: string;
  milestone_name: string;
  tasklist_id: string;
  tasklist_name: string;
  tags: string[];
  custom_fields: Record<string, any>;
  subtasks: Array<{
    id: string;
    name: string;
    status: string;
    assignee_id: string;
  }>;
  dependencies: string[];
  comments_count: number;
  attachments_count: number;
}

export interface ZohoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  avatar: string;
  status: string;
  timezone: string;
  phone: string;
  hire_date: string;
  skills: string[];
  projects_assigned: string[];
  permissions: Record<string, string[]>;
  stakeholder_config?: {
    assigned_by_pm: string;
    enabled_views: Record<string, boolean>;
    data_access: Record<string, boolean>;
    filters: Record<string, any>;
  };
}

export interface ZohoMilestone {
  id: string;
  id_string: string;
  project_id: string;
  project_name: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  start_date_long: number;
  end_date_long: number;
  created_date: string;
  updated_date: string;
  completed_date: string | null;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  flag: string;
  task_count: {
    open: number;
    closed: number;
    total: number;
  };
  progress_percentage: number;
  is_overdue: boolean;
  custom_fields: Record<string, any>;
}

export interface ProjectsMetrics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  on_hold_projects: number;
  total_budget: string;
  total_team_members: number;
  total_tasks: number;
  completed_tasks: number;
  on_time_percentage: number;
}

export interface StakeholderPermissions {
  user_id: string;
  user_name: string;
  assigned_by_pm: string;
  pm_name: string;
  project_ids: string[];
  enabled_views: Record<string, boolean>;
  data_access: Record<string, boolean>;
  filters: Record<string, any>;
  custom_restrictions: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly API_BASE_URL = '/api/v1/zoho';
  private readonly MOCK_DATA_PATH = '/assets/data/Zoho_API_mock';
  
  // Signals para estado reactivo
  private projectsSubject = new BehaviorSubject<ZohoProject[]>([]);
  private tasksSubject = new BehaviorSubject<ZohoTask[]>([]);
  private usersSubject = new BehaviorSubject<ZohoUser[]>([]);
  private milestonesSubject = new BehaviorSubject<ZohoMilestone[]>([]);
  private metricsSubject = new BehaviorSubject<ProjectsMetrics | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  public projects$ = this.projectsSubject.asObservable();
  public tasks$ = this.tasksSubject.asObservable();
  public users$ = this.usersSubject.asObservable();
  public milestones$ = this.milestonesSubject.asObservable();
  public metrics$ = this.metricsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Cache para optimización
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos

  constructor(private http: HttpClient) {
    this.initializeService();
  }

  private initializeService(): void {
    console.log('🚀 ProjectsService initialized - Zoho Projects Integration');
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.setLoading(true);
      this.setError(null);

      // Cargar datos en paralelo
      const [projects, users, metrics] = await Promise.all([
        this.loadProjects().toPromise(),
        this.loadUsers().toPromise(),
        this.loadMetrics().toPromise()
      ]);

      console.log('✅ Initial data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      this.setError('Error al cargar datos iniciales');
      this.loadFallbackData();
    } finally {
      this.setLoading(false);
    }
  }

  // ===== PROJECTS API =====
  
  public loadProjects(): Observable<ZohoProject[]> {
    const cacheKey = 'projects';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.projectsSubject.next(cached);
      return of(cached);
    }

    return this.http.get<{ projects: ZohoProject[] }>(`${this.MOCK_DATA_PATH}/projects.json`)
      .pipe(
        delay(500), // Simular latencia de API
        map(response => response.projects),
        tap(projects => {
          this.setInCache(cacheKey, projects);
          this.projectsSubject.next(projects);
          console.log(`📁 Loaded ${projects.length} projects`);
        }),
        catchError(error => this.handleError('Error loading projects', error))
      );
  }

  public getProject(projectId: string): Observable<ZohoProject | null> {
    return this.projects$.pipe(
      map(projects => projects.find(p => p.id === projectId) || null)
    );
  }

  public getProjectsByUser(userId: string): Observable<ZohoProject[]> {
    return this.projects$.pipe(
      map(projects => projects.filter(p => p.owner_id === userId))
    );
  }

  public getProjectsByStatus(status: string): Observable<ZohoProject[]> {
    return this.projects$.pipe(
      map(projects => projects.filter(p => p.status === status))
    );
  }

  // ===== TASKS API =====
  
  public loadTasks(projectId?: string): Observable<ZohoTask[]> {
    const cacheKey = projectId ? `tasks_${projectId}` : 'tasks';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.tasksSubject.next(cached);
      return of(cached);
    }

    return this.http.get<{ tasks: ZohoTask[] }>(`${this.MOCK_DATA_PATH}/tasks.json`)
      .pipe(
        delay(300),
        map(response => {
          let tasks = response.tasks;
          if (projectId) {
            tasks = tasks.filter(task => task.project_id === projectId);
          }
          return tasks;
        }),
        tap(tasks => {
          this.setInCache(cacheKey, tasks);
          this.tasksSubject.next(tasks);
          console.log(`✅ Loaded ${tasks.length} tasks`);
        }),
        catchError(error => this.handleError('Error loading tasks', error))
      );
  }

  public getTasksByUser(userId: string): Observable<ZohoTask[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(t => t.assignee.id === userId))
    );
  }

  public getTasksByStatus(status: string): Observable<ZohoTask[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(t => t.status === status))
    );
  }

  // ===== USERS API =====
  
  public loadUsers(): Observable<ZohoUser[]> {
    const cacheKey = 'users';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.usersSubject.next(cached);
      return of(cached);
    }

    return this.http.get<{ users: ZohoUser[] }>(`${this.MOCK_DATA_PATH}/users.json`)
      .pipe(
        delay(200),
        map(response => response.users),
        tap(users => {
          this.setInCache(cacheKey, users);
          this.usersSubject.next(users);
          console.log(`👥 Loaded ${users.length} users`);
        }),
        catchError(error => this.handleError('Error loading users', error))
      );
  }

  public getUser(userId: string): Observable<ZohoUser | null> {
    return this.users$.pipe(
      map(users => users.find(u => u.id === userId) || null)
    );
  }

  public getUsersByRole(role: string): Observable<ZohoUser[]> {
    return this.users$.pipe(
      map(users => users.filter(u => u.role === role))
    );
  }

  // ===== MILESTONES API =====
  
  public loadMilestones(projectId?: string): Observable<ZohoMilestone[]> {
    const cacheKey = projectId ? `milestones_${projectId}` : 'milestones';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.milestonesSubject.next(cached);
      return of(cached);
    }

    return this.http.get<{ milestones: ZohoMilestone[] }>(`${this.MOCK_DATA_PATH}/milestones.json`)
      .pipe(
        delay(250),
        map(response => {
          let milestones = response.milestones;
          if (projectId) {
            milestones = milestones.filter(m => m.project_id === projectId);
          }
          return milestones;
        }),
        tap(milestones => {
          this.setInCache(cacheKey, milestones);
          this.milestonesSubject.next(milestones);
          console.log(`🎯 Loaded ${milestones.length} milestones`);
        }),
        catchError(error => this.handleError('Error loading milestones', error))
      );
  }

  // ===== METRICS API =====
  
  public loadMetrics(): Observable<ProjectsMetrics> {
    const cacheKey = 'metrics';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.metricsSubject.next(cached);
      return of(cached);
    }

    // Calcular métricas desde los datos cargados
    return this.projects$.pipe(
      map(projects => {
        const metrics: ProjectsMetrics = {
          total_projects: projects.length,
          active_projects: projects.filter(p => p.status === 'active').length,
          completed_projects: projects.filter(p => p.status === 'completed').length,
          on_hold_projects: projects.filter(p => p.status === 'on_hold').length,
          total_budget: projects.reduce((sum, p) => sum + parseInt(p.budget_value), 0).toString(),
          total_team_members: projects.reduce((sum, p) => sum + p.team_count, 0),
          total_tasks: projects.reduce((sum, p) => sum + p.task_count.total, 0),
          completed_tasks: projects.reduce((sum, p) => sum + p.task_count.closed, 0),
          on_time_percentage: Math.round(
            (projects.filter(p => p.progress_metrics.on_schedule).length / projects.length) * 100
          )
        };
        
        this.setInCache(cacheKey, metrics);
        this.metricsSubject.next(metrics);
        return metrics;
      })
    );
  }

  // ===== PERMISSIONS API =====
  
  public loadStakeholderPermissions(): Observable<StakeholderPermissions[]> {
    return this.http.get<{ stakeholder_configurations: StakeholderPermissions[] }>(`${this.MOCK_DATA_PATH}/permissions.json`)
      .pipe(
        map(response => response.stakeholder_configurations),
        catchError(error => this.handleError('Error loading permissions', error))
      );
  }

  public getStakeholderPermissions(userId: string): Observable<StakeholderPermissions | null> {
    return this.loadStakeholderPermissions().pipe(
      map(permissions => permissions.find(p => p.user_id === userId) || null)
    );
  }

  // ===== UTILITY METHODS =====
  
  public refreshData(): void {
    console.log('🔄 Refreshing projects data...');
    this.clearCache();
    this.loadInitialData();
  }

  public searchProjects(query: string): Observable<ZohoProject[]> {
    return this.projects$.pipe(
      map(projects => {
        const searchTerm = query.toLowerCase();
        return projects.filter(project =>
          project.name.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.owner_name.toLowerCase().includes(searchTerm) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      })
    );
  }

  public filterProjects(filters: {
    status?: string;
    priority?: string;
    owner?: string;
    category?: string;
  }): Observable<ZohoProject[]> {
    return this.projects$.pipe(
      map(projects => {
        return projects.filter(project => {
          if (filters.status && project.status !== filters.status) return false;
          if (filters.priority && project.priority !== filters.priority) return false;
          if (filters.owner && project.owner_id !== filters.owner) return false;
          if (filters.category && project.category !== filters.category) return false;
          return true;
        });
      })
    );
  }

  // ===== PRIVATE METHODS =====
  
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  private handleError(context: string, error: any): Observable<never> {
    console.error(`❌ ${context}:`, error);
    
    let errorMessage = 'Error de conexión con Zoho Projects';
    
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errorMessage = 'Sin conexión a internet';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor Zoho Projects';
      } else if (error.status === 401) {
        errorMessage = 'Credenciales de Zoho Projects inválidas';
      } else if (error.status === 403) {
        errorMessage = 'Sin permisos para acceder a Zoho Projects';
      }
    }
    
    this.setError(errorMessage);
    return throwError(() => error);
  }

  private loadFallbackData(): void {
    console.warn('⚠️ Loading fallback data for projects');
    
    const fallbackProjects: ZohoProject[] = [
      {
        id: 'fallback-1',
        id_string: 'fallback-1',
        name: 'Proyecto de Ejemplo - Modo Sin Conexión',
        description: 'Datos no disponibles temporalmente',
        status: 'active',
        priority: 'medium',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        start_date_long: Date.now(),
        end_date_long: Date.now() + (365 * 24 * 60 * 60 * 1000),
        created_date: '2024-01-01',
        updated_date: '2024-01-01',
        project_percent: 0,
        budget_value: '0',
        currency: 'CLP',
        owner_id: 'fallback-user',
        owner_name: 'Usuario Demo',
        role: 'admin',
        is_public: 'no',
        is_strict: 'no',
        taskbug_prefix: 'DEMO',
        bug_prefix: 'DEMO-BUG',
        custom_status_id: 'demo-status',
        layout_details: {
          task: { name: 'Demo Layout', id: 'demo-task-layout' },
          project: { name: 'Demo Project Layout', id: 'demo-project-layout' }
        },
        task_count: { open: 0, closed: 0, total: 0 },
        milestone_count: { open: 0, closed: 0, total: 0 },
        bug_count: { open: 0, closed: 0, total: 0 },
        team_count: 0,
        category: 'Demo',
        tags: ['fallback', 'demo'],
        custom_fields: {},
        progress_metrics: {
          tasks_completed_this_week: 0,
          hours_logged_this_week: 0,
          budget_spent_percentage: 0,
          on_schedule: true
        }
      }
    ];

    const fallbackMetrics: ProjectsMetrics = {
      total_projects: 1,
      active_projects: 1,
      completed_projects: 0,
      on_hold_projects: 0,
      total_budget: '0',
      total_team_members: 0,
      total_tasks: 0,
      completed_tasks: 0,
      on_time_percentage: 100
    };

    this.projectsSubject.next(fallbackProjects);
    this.metricsSubject.next(fallbackMetrics);
    this.tasksSubject.next([]);
    this.usersSubject.next([]);
    this.milestonesSubject.next([]);
  }

  // ===== CACHE MANAGEMENT =====
  
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setInCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Projects cache cleared');
  }
}
