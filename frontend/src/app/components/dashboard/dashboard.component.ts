import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  permissions: string[];
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  // Styles handled by global SCSS system
})
export class DashboardComponent implements OnInit {
  currentUser = signal<User | null>(null);
  availableModules = signal<Module[]>([]);

  private allModules: Module[] = [
    {
      id: 'ciberseguridad',
      name: 'Ciberseguridad',
      description: 'Dashboard de seguridad, incidentes y vulnerabilidades',
      icon: '🛡️',
      route: '/modules/ciberseguridad',
      color: 'red',
      permissions: ['ciberseguridad']
    },
    {
      id: 'proyectos',
      name: 'Proyectos',
      description: 'Gestión y seguimiento de proyectos institucionales',
      icon: '📊',
      route: '/modules/proyectos',
      color: 'blue',
      permissions: ['proyectos']
    },
    {
      id: 'cms',
      name: 'CMS & Datos',
      description: 'Gestión de contenido público y datos analíticos',
      icon: '⚙️',
      route: '/modules/cms',
      color: 'green',
      permissions: ['cms', 'datos']
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
