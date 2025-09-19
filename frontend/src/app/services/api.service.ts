import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  debug?: any;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  manager_id?: string;
  team_size: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manager?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  category_id?: string;
  author_id?: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface HomeSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  button_text: string;
  button_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomeMetric {
  id: string;
  title: string;
  subtitle: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  hasButton: boolean;
  buttonText: string;
  buttonAction: string;
}

export interface CybersecurityItem {
  id: string;
  title: string;
  description: string;
  details: string;
  image_url: string;
  item_type: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  category_id: string;
  author_id: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    name: string;
    email: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
    color_hex: string;
    icon: string;
  }>;
}

export interface BulletinBoardItem {
  id: string;
  title: string;
  content: string;
  type: string;
  category_id: string;
  author_id: string;
  valid_from: string;
  valid_until: string;
  is_urgent: boolean;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';
  private apiUrl = `${this.baseUrl}/v1`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    console.log('🔗 ApiService initialized - Backend URL:', this.baseUrl);
  }

  // Health check
  healthCheck(): Observable<any> {
    console.log('🔍 [API] Health check');
    return this.http.get(`${this.baseUrl}/health`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Debug info
  getDebugInfo(): Observable<any> {
    console.log('🔍 [API] Getting debug info');
    return this.http.get(`${this.baseUrl}/debug`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Projects API
  getProjects(): Observable<Project[]> {
    console.log('🔍 [API] Getting projects');
    return this.http.get<ApiResponse<Project[]>>(`${this.apiUrl}/projects`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Projects received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  getProject(id: string): Observable<Project> {
    console.log('🔍 [API] Getting project:', id);
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Project received:', response.data.name);
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  createProject(project: Partial<Project>): Observable<Project> {
    console.log('🔍 [API] Creating project:', project.name);
    return this.http.post<ApiResponse<Project>>(`${this.apiUrl}/projects`, project, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Project created:', response.data.id);
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    console.log('🔍 [API] Updating project:', id);
    return this.http.put<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`, project, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Project updated:', response.data.id);
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  deleteProject(id: string): Observable<any> {
    console.log('🔍 [API] Deleting project:', id);
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/projects/${id}`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Project deleted:', id);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getProjectStats(): Observable<any> {
    console.log('🔍 [API] Getting project statistics');
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/projects-stats`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Project stats received');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  // News API
  getNews(): Observable<News[]> {
    console.log('🔍 [API] Getting news');
    return this.http.get<ApiResponse<News[]>>(`${this.apiUrl}/news`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] News received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  getFeaturedNews(): Observable<News[]> {
    console.log('🔍 [API] Getting featured news');
    return this.http.get<ApiResponse<News[]>>(`${this.apiUrl}/news-featured`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Featured news received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  getNewsById(id: string): Observable<News> {
    console.log('🔍 [API] Getting news by ID:', id);
    return this.http.get<ApiResponse<News>>(`${this.apiUrl}/news/${id}`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] News item received:', response.data.title);
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  // Bulletin Board API
  getBulletinBoard(): Observable<BulletinBoardItem[]> {
    console.log('🔍 [API] Getting bulletin board items');
    return this.http.get<ApiResponse<BulletinBoardItem[]>>(`${this.apiUrl}/bulletin-board`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Bulletin board items received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  getBulletinBoardById(id: string): Observable<BulletinBoardItem> {
    console.log('🔍 [API] Getting bulletin board item by ID:', id);
    return this.http.get<ApiResponse<BulletinBoardItem>>(`${this.apiUrl}/bulletin-board/${id}`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Bulletin board item received:', response.data.title);
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  // Services API
  getServices(): Observable<ServiceItem[]> {
    console.log('🔍 [API] Getting services');
    return this.http.get<ApiResponse<ServiceItem[]>>(`${this.apiUrl}/services`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Services received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  // Cybersecurity API
  getCybersecurity(): Observable<CybersecurityItem[]> {
    console.log('🔍 [API] Getting cybersecurity items');
    return this.http.get<ApiResponse<CybersecurityItem[]>>(`${this.apiUrl}/cybersecurity`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Cybersecurity items received:', response.count, 'items');
          // Transform to match frontend expectations
          return response.data.map(item => ({
            ...item,
            image: item.image_url, // Map image_url to image for compatibility
            hasButton: false, // Default for now
            buttonText: '',
            buttonAction: ''
          }));
        }),
        catchError(this.handleError)
      );
  }

  getCybersecurityByType(type: string): Observable<CybersecurityItem[]> {
    console.log('🔍 [API] Getting cybersecurity items by type:', type);
    return this.http.get<ApiResponse<CybersecurityItem[]>>(`${this.apiUrl}/cybersecurity/type/${type}`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Cybersecurity items by type received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  // Users API
  getUsers(): Observable<any[]> {
    console.log('🔍 [API] Getting users');
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/users`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Users received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  // Home API
  getHomeSlides(): Observable<HomeSlide[]> {
    console.log('🔍 [API] Getting home slides');
    return this.http.get<ApiResponse<HomeSlide[]>>(`${this.apiUrl}/home/slides`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Home slides received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  getHomeMetrics(): Observable<HomeMetric[]> {
    console.log('🔍 [API] Getting home metrics');
    return this.http.get<ApiResponse<HomeMetric[]>>(`${this.apiUrl}/home/metrics`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Home metrics received:', response.count, 'items');
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  getHomeOverview(): Observable<{slides: HomeSlide[], metrics: HomeMetric[]}> {
    console.log('🔍 [API] Getting home overview');
    return this.http.get<ApiResponse<{slides: HomeSlide[], metrics: HomeMetric[]}>>(`${this.apiUrl}/home/overview`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ [API] Home overview received - Slides:', response.data.slides.length, 'Metrics:', response.data.metrics.length);
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('❌ [API] Error occurred:', error);
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }
    
    console.error('❌ [API] Error details:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
