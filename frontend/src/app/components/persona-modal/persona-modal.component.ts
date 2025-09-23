import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-persona-modal',
  imports: [CommonModule],
  templateUrl: './persona-modal.component.html',
  styleUrls: ['./persona-modal.component.css']
})
export class PersonaModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  
  demoUsers = signal<User[]>([]);
  adminUser = signal<User | null>(null);
  selectedUser = signal<User | null>(null);
  isLoading = signal(false);
  showConfirmation = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDemoUsers();
    this.loadAdminUser();
  }

  loadDemoUsers() {
    this.authService.getDemoUsers().subscribe({
      next: (users) => {
        this.demoUsers.set(users);
        console.log('✅ [PersonaModal] Usuarios demo cargados:', users.length);
      },
      error: (error) => {
        console.error('❌ [PersonaModal] Error cargando usuarios demo:', error);
      }
    });
  }

  loadAdminUser() {
    // Cargar el usuario admin desde la API
    this.authService.getAdminUser().subscribe({
      next: (admin) => {
        if (admin) {
          this.adminUser.set(admin);
          console.log('👑 [PersonaModal] Usuario admin cargado desde API:', admin.name);
        }
      },
      error: (error) => {
        console.error('❌ [PersonaModal] Error cargando admin:', error);
        // Fallback: usar usuario actual si es admin
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.role === 'admin') {
          this.adminUser.set(currentUser);
          console.log('👑 [PersonaModal] Usando admin actual como fallback:', currentUser.name);
        }
      }
    });
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
    console.log('👤 [PersonaModal] Usuario seleccionado:', user.name);
    // Mostrar modal de confirmación automáticamente
    this.showConfirmation.set(true);
    console.log('📋 [PersonaModal] Mostrando modal de confirmación automáticamente');
  }

  cancelConfirmation() {
    this.showConfirmation.set(false);
    console.log('❌ [PersonaModal] Confirmación cancelada');
  }

  confirmSelection() {
    const user = this.selectedUser();
    if (!user) return;

    this.isLoading.set(true);
    
    this.authService.switchToUser(user.id).subscribe({
      next: (switchedUser) => {
        if (switchedUser) {
          console.log('✅ [PersonaModal] Cambiado a usuario:', switchedUser.name);
          this.showConfirmation.set(false);
          this.closeModal.emit();
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('❌ [PersonaModal] Error cambiando usuario:', error);
        this.isLoading.set(false);
      }
    });
  }

  close() {
    // Si se cierra el modal sin seleccionar, cargar como admin por defecto
    const adminUser = this.adminUser();
    if (adminUser) {
      console.log('👑 [PersonaModal] Cerrando modal - Cargando como admin por defecto');
      this.authService.switchToUser(adminUser.id).subscribe({
        next: (switchedUser) => {
          if (switchedUser) {
            console.log('✅ [PersonaModal] Cargado como admin:', switchedUser.name);
            this.closeModal.emit();
            this.router.navigate(['/dashboard']);
          } else {
            console.warn('⚠️ [PersonaModal] No se pudo cargar admin, cerrando modal');
            this.closeModal.emit();
          }
        },
        error: (error) => {
          console.error('❌ [PersonaModal] Error cargando admin:', error);
          this.closeModal.emit();
        }
      });
    } else {
      console.warn('⚠️ [PersonaModal] No hay usuario admin disponible');
      this.closeModal.emit();
    }
  }

  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'stakeholder': 'Stakeholder',
      'project_manager': 'Jefe de Proyectos',
      'developer': 'Desarrollador',
      'security_analyst': 'Analista de Seguridad'
    };
    return roleNames[role] || role;
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'stakeholder': 'bg-orange-500',
      'project_manager': 'bg-blue-500',
      'developer': 'bg-green-500',
      'security_analyst': 'bg-red-500'
    };
    return colors[role] || 'bg-gray-500';
  }

  getTooltipText(user: User): string {
    const scenarios: { [key: string]: string } = {
      'stakeholder': `Simula la experiencia de un stakeholder académico que necesita analizar métricas estudiantiles y seguimiento de proyectos. Acceso limitado a datos y reportes específicos de su área.`,
      'project_manager': `Simula la experiencia de un jefe de proyectos TI que gestiona múltiples iniciativas institucionales. Acceso completo a gestión de proyectos, datos analíticos y herramientas CMS.`,
      'developer': `Simula la experiencia de un desarrollador full-stack enfocado en CMS y gestión de contenido. Acceso a herramientas de desarrollo y administración de contenido web.`,
      'security_analyst': `Simula la experiencia de un analista de ciberseguridad que monitorea amenazas y vulnerabilidades. Acceso especializado en módulos de seguridad y análisis de datos.`
    };
    return scenarios[user.role] || 'Usuario de demostración';
  }

  getAdminTooltipText(): string {
    return 'Simula la experiencia del administrador del sistema con acceso completo a todos los módulos: Ciberseguridad, Proyectos, CMS, Datos y Dashboards ejecutivos. Ideal para demostraciones completas del sistema.';
  }
}
