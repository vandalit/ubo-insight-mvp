import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  permissions: string[];
  avatar: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  demo?: boolean;
  department?: string;
  projects?: string[];
  description?: string;
  securityClearance?: string;
  specializations?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signals para el nuevo sistema
  public isAuthenticated = signal(false);
  public currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<User | null> {
    return this.http.get<User[]>('assets/data/usuarios.json').pipe(
      map(users => {
        const user = users.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password &&
          u.isActive
        );
        
        if (user) {
          // Actualizar lastLogin
          user.lastLogin = new Date().toISOString();
          this.setCurrentUser(user);
          return user;
        }
        return null;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  hasPermission(module: string): boolean {
    const user = this.currentUser();
    return user?.permissions.includes(module) || false;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getDemoUsers(): Observable<User[]> {
    return this.http.get<User[]>('assets/data/usuarios.json').pipe(
      map(users => users.filter(user => user.demo === true))
    );
  }

  isAdminUser(): boolean {
    const user = this.currentUser();
    return user?.email === 'uboinsight@ubo.cl' && user?.role === 'admin';
  }

  switchToUser(userId: string): Observable<User | null> {
    return this.http.get<User[]>('assets/data/usuarios.json').pipe(
      map(users => {
        const user = users.find(u => u.id === userId && u.isActive);
        if (user) {
          // Actualizar lastLogin
          user.lastLogin = new Date().toISOString();
          this.setCurrentUser(user);
          return user;
        }
        return null;
      })
    );
  }

  // ===== MÉTODOS ESPECÍFICOS PARA CIBERSEGURIDAD =====

  // Obtener usuarios con roles de ciberseguridad
  getCybersecurityUsers(): Observable<User[]> {
    return this.http.get<User[]>('assets/data/usuarios.json').pipe(
      map(users => users.filter(user => 
        user.isActive && 
        ['security_analyst', 'ciso', 'compliance_officer', 'incident_responder', 'security_architect', 'admin'].includes(user.role)
      ))
    );
  }

  // Verificar si el usuario tiene clearance de seguridad
  hasSecurityClearance(requiredLevel: number): boolean {
    const user = this.currentUser();
    if (!user?.securityClearance) return false;
    
    const userLevel = parseInt(user.securityClearance.replace('Level ', ''));
    return userLevel >= requiredLevel;
  }

  // Obtener especialización del usuario
  getUserSpecializations(): string[] {
    const user = this.currentUser();
    return user?.specializations || [];
  }

  // Verificar si el usuario puede asignar permisos
  canAssignPermissions(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin' || 
           user?.role === 'project_manager' || 
           user?.role === 'ciso';
  }

  // Obtener nivel de acceso a workspaces de ciberseguridad
  getCybersecurityAccessLevel(): 'full' | 'limited' | 'readonly' | 'none' {
    const user = this.currentUser();
    if (!user) return 'none';

    switch (user.role) {
      case 'admin':
      case 'ciso':
        return 'full';
      case 'security_analyst':
      case 'incident_responder':
      case 'security_architect':
        return 'limited';
      case 'compliance_officer':
      case 'project_manager':
        return 'readonly';
      default:
        return 'none';
    }
  }

  // Obtener color del rol para UI
  getRoleColor(role?: string): string {
    const userRole = role || this.currentUser()?.role;
    const colors: Record<string, string> = {
      'admin': '#7c3aed',
      'ciso': '#7c3aed',
      'security_analyst': '#dc2626',
      'compliance_officer': '#10b981',
      'incident_responder': '#f59e0b',
      'security_architect': '#3b82f6',
      'project_manager': '#2563eb',
      'stakeholder': '#f39c12',
      'developer': '#059669'
    };
    return colors[userRole || ''] || '#6b7280';
  }

  // Obtener descripción del rol
  getRoleDescription(role?: string): string {
    const userRole = role || this.currentUser()?.role;
    const descriptions: Record<string, string> = {
      'admin': 'Administrador del Sistema',
      'ciso': 'Chief Information Security Officer',
      'security_analyst': 'Analista de Ciberseguridad',
      'compliance_officer': 'Oficial de Cumplimiento',
      'incident_responder': 'Especialista en Respuesta a Incidentes',
      'security_architect': 'Arquitecto de Seguridad',
      'project_manager': 'Jefe de Proyectos TI',
      'stakeholder': 'Stakeholder Institucional',
      'developer': 'Desarrollador Full-Stack'
    };
    return descriptions[userRole || ''] || 'Usuario';
  }

  // Verificar si el usuario puede ver datos sensibles
  canViewSensitiveData(): boolean {
    const user = this.currentUser();
    if (!user) return false;

    return ['admin', 'ciso', 'security_analyst', 'incident_responder'].includes(user.role) &&
           this.hasSecurityClearance(3);
  }

  // Obtener usuarios que pueden ser asignados a workspaces
  getAssignableUsers(): Observable<User[]> {
    return this.http.get<User[]>('assets/data/usuarios.json').pipe(
      map(users => users.filter(user => 
        user.isActive && 
        user.demo === true && 
        user.role !== 'admin'
      ))
    );
  }
}
