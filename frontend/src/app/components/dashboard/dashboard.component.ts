import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { NavbarInsightComponent } from '../shared/navbar-insight/navbar-insight.component';

interface Module {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  permissions: string[];
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NavbarInsightComponent],
  templateUrl: './dashboard.component.html',
  // Styles handled by global SCSS system
})
export class DashboardComponent implements OnInit {
  currentUser = signal<User | null>(null);
  availableModules = signal<Module[]>([]);

  private allModules: Module[] = [
    {
      id: 'ciberseguridad',
      key: 'ciberseguridad',
      name: 'Ciberseguridad',
      description: 'Dashboard de seguridad, incidentes y vulnerabilidades',
      icon: '',
      route: '/modules/ciberseguridad',
      color: 'red',
      permissions: ['ciberseguridad']
    },
    {
      id: 'proyectos',
      key: 'proyectos',
      name: 'Proyectos',
      description: 'Gestión y seguimiento de proyectos institucionales',
      icon: '',
      route: '/modules/proyectos',
      color: 'blue',
      permissions: ['proyectos']
    },
    {
      id: 'cms',
      key: 'cms',
      name: 'CMS & Datos',
      description: 'Gestión de contenido público y datos analíticos',
      icon: '',
      route: '/modules/cms',
      color: 'green',
      permissions: ['cms', 'datos']
    },
    {
      id: 'servicios',
      key: 'servicios',
      name: 'Servicios',
      description: 'Gestión de servicios digitales institucionales',
      icon: '',
      route: '/modules/servicios',
      color: 'purple',
      permissions: ['servicios']
    },
    {
      id: 'analytics',
      key: 'analytics',
      name: 'Analytics',
      description: 'Análisis de datos y métricas institucionales',
      icon: '',
      route: '/modules/analytics',
      color: 'orange',
      permissions: ['datos']
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser.set(user);
    this.loadAvailableModules(user);
  }

  private loadAvailableModules(user: User): void {
    const modules = this.allModules.filter(module => 
      module.permissions.some(permission => 
        user.permissions.includes(permission)
      )
    );
    this.availableModules.set(modules);
    console.log('📊 [Dashboard] Módulos disponibles para', user.name + ':', modules.map(m => m.name));
  }

  // Obtener saludo personalizado según el rol
  getPersonalizedGreeting(): string {
    const user = this.currentUser();
    if (!user) return 'Bienvenido';

    const greetings: { [key: string]: string } = {
      'admin': `Bienvenido, ${user.name}`,
      'stakeholder': `Hola ${user.name.split(' ')[0]}, aquí tienes tus métricas`,
      'project_manager': `Buenos días ${user.name.split(' ')[0]}, gestiona tus proyectos`,
      'developer': `Hola ${user.name.split(' ')[0]}, accede al CMS`,
      'security_analyst': `${user.name.split(' ')[0]}, revisa el estado de seguridad`
    };

    return greetings[user.role] || `Bienvenido, ${user.name}`;
  }

  // Obtener descripción personalizada según el rol
  getPersonalizedDescription(): string {
    const user = this.currentUser();
    if (!user) return 'Dashboard ejecutivo';

    const descriptions: { [key: string]: string } = {
      'admin': 'Panel de administración completo con acceso a todos los módulos',
      'stakeholder': 'Análisis de métricas y seguimiento de proyectos asignados',
      'project_manager': 'Gestión integral de proyectos y asignación de permisos',
      'developer': 'Herramientas de desarrollo y gestión de contenido',
      'security_analyst': 'Monitoreo de seguridad y análisis de amenazas'
    };

    return descriptions[user.role] || 'Dashboard personalizado';
  }

  // Verificar si el usuario tiene un permiso específico
  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  // Obtener información del departamento
  getDepartmentInfo(): string {
    const user = this.currentUser();
    return user?.department || 'Departamento no especificado';
  }

  // Obtener proyectos asignados
  getAssignedProjects(): string[] {
    const user = this.currentUser();
    return user?.projects || [];
  }

  navigateToModule(module: Module): void {
    this.router.navigate([module.route]);
  }

  getModuleColorClasses(color: string): string {
    const colorMap: { [key: string]: string } = {
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    };
    return colorMap[color] || colorMap['blue'];
  }

  getModuleIcon(moduleKey: string): string {
    const iconMap: { [key: string]: string } = {
      'ciberseguridad': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'proyectos': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'servicios': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      'cms': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      'analytics': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    };
    return iconMap[moduleKey] || 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586l-2 2V5H5v14h14v-3.586l2-2V19a1 1 0 01-1 1H4a1 1 0 01-1-1V4z';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
