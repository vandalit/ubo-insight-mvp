import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';

interface ProductTab {
  id: string;
  title: string;
  icon: string;
  content: {
    title: string;
    description: string;
    features?: string[];
  };
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = signal<LoginCredentials>({ email: '', password: '' });
  isLoading = signal(false);
  errorMessage = signal('');
  activeTabIndex = signal(0);

  // Tabs del producto UBO Insight
  productTabs = signal<ProductTab[]>([
    {
      id: 'dashboard',
      title: 'Dashboard Ejecutivo',
      icon: '📊',
      content: {
        title: 'Dashboards Inteligentes',
        description: 'Visualiza métricas clave de tu departamento TI con gráficos interactivos en tiempo real. Monitorea proyectos, servicios y KPIs desde una vista centralizada.',
        features: [
          'Gráficos Chart.js interactivos',
          'KPIs en tiempo real',
          'Métricas de proyectos y servicios',
          'Indicadores de ciberseguridad'
        ]
      }
    },
    {
      id: 'services',
      title: 'Gestión de Servicios',
      icon: '🔧',
      content: {
        title: 'Servicios Digitales Centralizados',
        description: 'Administra todos los servicios digitales universitarios desde una plataforma única. Controla accesos, monitorea disponibilidad y gestiona incidencias.',
        features: [
          'Catálogo de servicios digitales',
          'Monitoreo de disponibilidad',
          'Gestión de accesos y permisos',
          'Reportes de uso y performance'
        ]
      }
    },
    {
      id: 'security',
      title: 'Ciberseguridad',
      icon: '🛡️',
      content: {
        title: 'Seguridad Institucional Avanzada',
        description: 'Protege la infraestructura universitaria con herramientas de monitoreo, auditoría y respuesta a incidentes. Mantén la seguridad de datos académicos.',
        features: [
          'Monitoreo de amenazas 24/7',
          'Auditorías de seguridad automatizadas',
          'Gestión de incidentes CERT-UBO',
          'Políticas de seguridad institucional'
        ]
      }
    },
    {
      id: 'analytics',
      title: 'Analytics & CMS',
      icon: '📈',
      content: {
        title: 'Análisis de Datos y Gestión de Contenido',
        description: 'Analiza patrones de uso, genera reportes ejecutivos y gestiona el contenido de la plataforma. Toma decisiones basadas en datos reales.',
        features: [
          'Analytics avanzados con ML',
          'Reportes ejecutivos automatizados',
          'CMS para gestión de contenido',
          'Integración con sistemas externos'
        ]
      }
    }
  ]);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials().email || !this.credentials().password) {
      this.errorMessage.set('Por favor ingresa email y contraseña');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.credentials()).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (user) {
          console.log('Login exitoso:', user);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Credenciales incorrectas');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al iniciar sesión');
        console.error('Error login:', error);
      }
    });
  }

  updateCredentials(field: keyof LoginCredentials, value: string): void {
    this.credentials.update(creds => ({
      ...creds,
      [field]: value
    }));
  }

  quickLogin(userType: 'admin'): void {
    const quickCredentials = {
      admin: { email: 'uboinsight@ubo.cl', password: 'admin123' }
    };

    this.credentials.set(quickCredentials[userType]);
    this.onSubmit();
  }

  // Métodos para manejo de tabs
  setActiveTab(index: number): void {
    this.activeTabIndex.set(index);
  }

  activeTabContent() {
    return this.productTabs()[this.activeTabIndex()].content;
  }

  getTabClasses(index: number): string {
    const baseClasses = 'px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    const activeClasses = 'bg-blue-600 text-white shadow-lg';
    const inactiveClasses = 'bg-white text-gray-700 hover:bg-blue-50 shadow-md';
    
    return this.activeTabIndex() === index ? activeClasses : inactiveClasses;
  }
}
