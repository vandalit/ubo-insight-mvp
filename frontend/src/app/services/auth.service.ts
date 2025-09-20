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
}
