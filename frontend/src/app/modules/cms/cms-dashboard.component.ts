import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface CMSModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  count?: number;
}

@Component({
  selector: 'app-cms-dashboard',
  imports: [CommonModule],
  templateUrl: './cms-dashboard.component.html',
  styleUrls: ['./cms-dashboard.component.css']
})
export class CMSDashboardComponent implements OnInit {
  cmsModules = signal<CMSModule[]>([]);
  datosModules = signal<CMSModule[]>([]);
  hasDataPermission = signal(false);
  currentDate = new Date();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadModules();
    this.checkPermissions();
  }

  private loadModules(): void {
    const cms: CMSModule[] = [
      {
        id: 'home-content',
        name: 'Contenido Home',
        description: 'Gestionar slides, métricas y contenido principal',
        icon: '🏠',
        route: '/modules/cms/home',
        count: 6
      },
      {
        id: 'servicios-content',
        name: 'Servicios',
        description: 'Gestionar servicios institucionales',
        icon: '🛠️',
        route: '/modules/cms/services',
        count: 6
      },
      {
        id: 'news',
        name: 'Noticias',
        description: 'Administrar noticias y artículos',
        icon: '📰',
        route: '/modules/cms/news',
        count: 3
      },
      {
        id: 'diario-mural',
        name: 'Diario Mural',
        description: 'Gestionar avisos y comunicados',
        icon: '📋',
        route: '/modules/cms/diario-mural',
        count: 4
      },
      {
        id: 'media',
        name: 'Multimedia',
        description: 'Gestionar imágenes y archivos multimedia',
        icon: '🎨',
        route: '/modules/cms/media',
        count: 0
      }
    ];

    const datos: CMSModule[] = [
      {
        id: 'security-analytics',
        name: 'Analytics Ciberseguridad',
        description: 'Datos simulados para dashboards de seguridad',
        icon: '📊',
        route: '/modules/datos/ciberseguridad'
      },
      {
        id: 'projects-analytics',
        name: 'Analytics Proyectos',
        description: 'Datos simulados para dashboards de proyectos',
        icon: '📈',
        route: '/modules/datos/proyectos'
      },
      {
        id: 'powerbi-config',
        name: 'Configuración PowerBI',
        description: 'Configurar conexiones y datasets',
        icon: '⚡',
        route: '/modules/datos/powerbi'
      },
      {
        id: 'zoho-config',
        name: 'Configuración Zoho',
        description: 'Configurar integraciones con Zoho Projects',
        icon: '🔗',
        route: '/modules/datos/zoho'
      }
    ];

    this.cmsModules.set(cms);
    this.datosModules.set(datos);
  }

  private checkPermissions(): void {
    this.hasDataPermission.set(this.authService.hasPermission('datos'));
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToModule(moduleId: string | CMSModule): void {
    if (typeof moduleId === 'string') {
      this.router.navigate([`/modules/cms/${moduleId}`]);
    } else {
      // Handle CMSModule object navigation
      const route = moduleId.route || moduleId.id;
      this.router.navigate([route]);
    }
  }
}
