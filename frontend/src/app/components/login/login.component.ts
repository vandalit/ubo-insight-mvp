import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials, User } from '../../services/auth.service';
import { PersonaModalComponent } from '../persona-modal/persona-modal.component';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

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
  imports: [CommonModule, FormsModule, PersonaModalComponent, NavbarComponent, FooterComponent],
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
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop&crop=center', // Gradiente azul-púrpura vibrante
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&crop=center', // Gradiente holográfico
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center'  // Gradiente neón multicolor
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
        'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&h=1080&fit=crop&crop=center', // Gradiente rosa-naranja dopamina
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&crop=center', // Gradiente verde-azul eléctrico
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop&crop=center'  // Gradiente magenta-amarillo
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
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=1080&fit=crop&crop=center', // Gradiente rojo-púrpura intenso
        'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1920&h=1080&fit=crop&crop=center', // Gradiente neón ciberpunk
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&crop=center'  // Gradiente azul-rosa eléctrico
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
        'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&h=1080&fit=crop&crop=center', // Gradiente violeta-dorado vibrante
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&h=1080&fit=crop&crop=center', // Gradiente arcoíris holográfico
        'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920&h=1080&fit=crop&crop=center'  // Gradiente turquesa-rosa dopamina
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
