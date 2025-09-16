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
  styleUrls: ['./dashboard.component.css']
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
  }

  navigateToModule(module: Module): void {
    this.router.navigate([module.route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getModuleColorClasses(color: string): string {
    const colorMap: { [key: string]: string } = {
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    };
    return colorMap[color] || colorMap.blue;
  }
}
