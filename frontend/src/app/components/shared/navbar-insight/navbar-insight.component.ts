import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  permissions: string[];
}

@Component({
  selector: 'app-navbar-insight',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-insight.component.html',
  styleUrl: './navbar-insight.component.css'
})
export class NavbarInsightComponent implements OnInit {
  isMenuOpen = signal(false);
  currentUser = signal<User | null>(null);

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586l-2 2V5H5v14h14v-3.586l2-2V19a1 1 0 01-1 1H4a1 1 0 01-1-1V4z',
      permissions: ['dashboard']
    },
    {
      label: 'Proyectos',
      route: '/proyectos',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      permissions: ['proyectos']
    },
    {
      label: 'Servicios',
      route: '/servicios-admin',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      permissions: ['servicios']
    },
    {
      label: 'Ciberseguridad',
      route: '/ciberseguridad',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      permissions: ['ciberseguridad']
    },
    {
      label: 'CMS',
      route: '/cms',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      permissions: ['cms']
    },
    {
      label: 'Analytics',
      route: '/analytics',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      permissions: ['datos']
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
  }

  getAvailableNavItems(): NavItem[] {
    const user = this.currentUser();
    if (!user) return [];

    return this.navItems.filter(item => 
      item.permissions.some(permission => 
        user.permissions?.includes(permission)
      )
    );
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user?.name) return 'U';
    
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  }

  getRoleColor(): string {
    const user = this.currentUser();
    switch (user?.role) {
      case 'admin': return 'bg-red-500';
      case 'project_manager': return 'bg-blue-500';
      case 'developer': return 'bg-green-500';
      case 'security_analyst': return 'bg-purple-500';
      case 'stakeholder': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  }

  getRoleName(): string {
    const user = this.currentUser();
    switch (user?.role) {
      case 'admin': return 'Administrador';
      case 'project_manager': return 'Jefe de Proyecto';
      case 'developer': return 'Desarrollador';
      case 'security_analyst': return 'Analista de Seguridad';
      case 'stakeholder': return 'Stakeholder';
      default: return 'Usuario';
    }
  }

  onMesaAyuda(): void {
    // Implementar lógica de mesa de ayuda
    console.log('Mesa de Ayuda - Departamento TI UBO');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
