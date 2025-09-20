import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials, User } from '../../services/auth.service';
import { PersonaModalComponent } from '../persona-modal/persona-modal.component';

interface ProductTab {
  id: string;
  title: string;
  icon: string;
  content: {
    title: string;
    description: string;
    features?: string[];
  };
  backgrounds: string[];
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, PersonaModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  credentials = signal<LoginCredentials>({ email: '', password: '' });
  isLoading = signal(false);
  errorMessage = signal('');
  activeTabIndex = signal(0);
  showPersonaModal = signal(false);
  currentBackgroundImage = signal('');
  
  private autoplayInterval: any;
  private readonly AUTOPLAY_DURATION = 5000; // 5 segundos

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
      },
      backgrounds: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1920&h=1080&fit=crop&crop=center'
      ]
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
      },
      backgrounds: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1920&h=1080&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop&crop=center'
      ]
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
      },
      backgrounds: [
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&h=1080&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=center'
      ]
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
      },
      backgrounds: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=1920&h=1080&fit=crop&crop=center'
      ]
    }
  ]);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateBackgroundImage();
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  private updateBackgroundImage() {
    const currentTab = this.productTabs()[this.activeTabIndex()];
    const randomIndex = Math.floor(Math.random() * currentTab.backgrounds.length);
    const selectedImage = currentTab.backgrounds[randomIndex];
    this.currentBackgroundImage.set(selectedImage);
    console.log('🖼️ [Login] Background actualizado:', selectedImage);
  }

  private startAutoplay() {
    this.stopAutoplay(); // Limpiar cualquier intervalo existente
    this.autoplayInterval = setInterval(() => {
      const nextIndex = (this.activeTabIndex() + 1) % this.productTabs().length;
      this.setActiveTab(nextIndex);
    }, this.AUTOPLAY_DURATION);
  }

  private stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  private getRandomBackgroundImage(backgrounds: string[]): string {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&h=1080&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&h=1080&fit=crop&crop=center'
    ];
    
    try {
      const randomIndex = Math.floor(Math.random() * backgrounds.length);
      return backgrounds[randomIndex] || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    } catch (error) {
      console.warn('🖼️ [Login] Error seleccionando imagen, usando fallback');
      return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }
  }

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
          console.log('✅ [Login] Usuario autenticado:', user.name);
          
          // Si es el usuario admin, mostrar modal de personas
          if (user.email === 'uboinsight@ubo.cl' && user.role === 'admin') {
            console.log('🎭 [Login] Usuario admin detectado - Mostrando modal de personas');
            this.showPersonaModal.set(true);
          } else {
            // Usuario normal, ir directo al dashboard
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMessage.set('Credenciales inválidas');
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
    this.updateBackgroundImage();
    // Reiniciar autoplay cuando el usuario cambia manualmente
    this.startAutoplay();
  }

  activeTabContent() {
    return this.productTabs()[this.activeTabIndex()].content;
  }

  getTabClasses(index: number): string {
    const activeClasses = 'bg-white/30 text-white border-white/50 shadow-2xl scale-105';
    const inactiveClasses = 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white shadow-lg';
    
    return this.activeTabIndex() === index ? activeClasses : inactiveClasses;
  }

  // Método para cerrar el modal de personas
  closePersonaModal() {
    console.log('🎭 [Login] Cerrando modal de personas');
    this.showPersonaModal.set(false);
  }
}
