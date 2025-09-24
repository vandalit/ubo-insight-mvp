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
    this.isLoading.set(true);
    this.authService.getDemoUsers().subscribe({
      next: (users) => {
        this.demoUsers.set(users);
        this.isLoading.set(false);
        console.log('✅ [PersonaModal] Usuarios demo cargados:', users.length);
        
        if (users.length === 0) {
          console.warn('⚠️ [PersonaModal] No se encontraron usuarios demo');
        }
      },
      error: (error) => {
        console.error('❌ [PersonaModal] Error cargando usuarios demo:', error);
        this.isLoading.set(false);
        // Intentar cargar usuarios demo directamente del JSON como último recurso
        this.loadDemoUsersFromJson();
      }
    });
  }

  private loadDemoUsersFromJson() {
    console.log('🔄 [PersonaModal] Intentando cargar usuarios demo directamente del JSON...');
    // Crear usuarios demo por defecto si todo falla
    const defaultDemoUsers: User[] = [
      {
        id: '2',
        email: 'carlos.mendez@ubo.cl',
        password: 'demo123',
        name: 'Carlos Méndez',
        role: 'stakeholder',
        permissions: ['proyectos', 'datos', 'compliance_access', 'risk_access'],
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Mendez&background=f39c12&color=fff&size=128',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '',
        isActive: true,
        demo: true,
        department: 'Dirección Académica',
        projects: ['Sistema de Gestión Académica', 'Portal Estudiantes'],
        description: 'Stakeholder enfocado en proyectos académicos y métricas básicas de ciberseguridad',
        securityClearance: 'Level 1',
        specializations: ['Academic Management', 'Risk Overview', 'Compliance Reporting']
      },
      {
        id: '3',
        email: 'maria.rodriguez@ubo.cl',
        password: 'demo123',
        name: 'María Rodríguez',
        role: 'project_manager',
        permissions: ['proyectos', 'datos', 'cms', 'incident_access', 'compliance_access', 'risk_access', 'team_management'],
        avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=2563eb&color=fff&size=128',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '',
        isActive: true,
        demo: true,
        department: 'Tecnologías de la Información',
        projects: ['UBO Insight MVP', 'Sistema de Ciberseguridad', 'Portal Institucional'],
        description: 'Jefe de Proyectos TI que administra múltiples proyectos',
        securityClearance: 'Level 3',
        specializations: ['Project Management', 'Team Leadership', 'Risk Management']
      },
      {
        id: '4',
        email: 'juan.silva@ubo.cl',
        password: 'demo123',
        name: 'Juan Silva',
        role: 'developer',
        permissions: ['cms', 'datos', 'vuln_access'],
        avatar: 'https://ui-avatars.com/api/?name=Juan+Silva&background=059669&color=fff&size=128',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '',
        isActive: true,
        demo: true,
        department: 'Desarrollo de Software',
        projects: ['UBO Insight MVP'],
        description: 'Desarrollador Full-Stack especializado en CMS',
        securityClearance: 'Level 2',
        specializations: ['Full-Stack Development', 'Vulnerability Assessment']
      },
      {
        id: '5',
        email: 'ana.torres@ubo.cl',
        password: 'demo123',
        name: 'Ana Torres',
        role: 'security_analyst',
        permissions: ['ciberseguridad', 'datos', 'soc_access', 'vuln_access', 'incident_access'],
        avatar: 'https://ui-avatars.com/api/?name=Ana+Torres&background=dc2626&color=fff&size=128',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '',
        isActive: true,
        demo: true,
        department: 'Ciberseguridad',
        projects: ['Sistema de Monitoreo de Seguridad'],
        description: 'Analista de Ciberseguridad enfocada en monitoreo de amenazas',
        securityClearance: 'Level 3',
        specializations: ['SOC Operations', 'Vulnerability Management']
      }
    ];
    
    this.demoUsers.set(defaultDemoUsers);
    console.log('📄 [PersonaModal] Usuarios demo cargados por defecto:', defaultDemoUsers.length);
  }

  loadAdminUser() {
    // Cargar el usuario admin desde la API
    this.authService.getAdminUser().subscribe({
      next: (admin) => {
        if (admin) {
          this.adminUser.set(admin);
          console.log('👑 [PersonaModal] Usuario admin cargado:', admin.name);
        } else {
          this.createDefaultAdmin();
        }
      },
      error: (error) => {
        console.error('❌ [PersonaModal] Error cargando admin:', error);
        this.createDefaultAdmin();
      }
    });
  }

  private createDefaultAdmin() {
    // Crear admin por defecto si no se puede cargar
    const defaultAdmin: User = {
      id: '1',
      email: 'admin@ubo.cl',
      password: 'admin123',
      name: 'Administrador UBO Insight',
      role: 'admin',
      permissions: ['ciberseguridad', 'proyectos', 'cms', 'datos', 'soc_access', 'vuln_access', 'incident_access', 'compliance_access', 'risk_access', 'admin_access'],
      avatar: 'https://ui-avatars.com/api/?name=Admin+UBO&background=0d2c5b&color=fff&size=128',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '',
      isActive: true,
      demo: false,
      department: 'Administración del Sistema',
      projects: ['Todos los proyectos'],
      description: 'Administrador con acceso completo al sistema',
      securityClearance: 'Level 5',
      specializations: ['System Administration', 'Full Access', 'User Management', 'Security Oversight']
    };
    
    this.adminUser.set(defaultAdmin);
    console.log('📄 [PersonaModal] Admin por defecto creado:', defaultAdmin.name);
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
        this.isLoading.set(false);
        if (switchedUser) {
          console.log('✅ [PersonaModal] Cambiado a usuario:', switchedUser.name);
          this.showConfirmation.set(false);
          this.closeModal.emit();
          this.router.navigate(['/dashboard']);
        } else {
          // Si no se pudo cambiar por API, usar el usuario directamente
          console.warn('⚠️ [PersonaModal] Usando usuario directamente');
          this.authService['setCurrentUser'](user);
          this.showConfirmation.set(false);
          this.closeModal.emit();
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('❌ [PersonaModal] Error con API, usando usuario directamente:', error);
        this.isLoading.set(false);
        // Fallback: usar el usuario directamente sin API
        this.authService['setCurrentUser'](user);
        this.showConfirmation.set(false);
        this.closeModal.emit();
        this.router.navigate(['/dashboard']);
      }
    });
  }

  close() {
    // Si se cierra el modal sin seleccionar, cargar como admin por defecto
    const adminUser = this.adminUser();
    if (adminUser) {
      console.log('👑 [PersonaModal] Cerrando modal - Cargando como admin por defecto');
      this.isLoading.set(true);
      
      this.authService.switchToUser(adminUser.id).subscribe({
        next: (switchedUser) => {
          this.isLoading.set(false);
          if (switchedUser) {
            console.log('✅ [PersonaModal] Cargado como admin:', switchedUser.name);
            this.closeModal.emit();
            this.router.navigate(['/dashboard']);
          } else {
            // Si no se pudo cambiar por API, usar el admin directamente
            console.warn('⚠️ [PersonaModal] Usando admin directamente');
            this.authService['setCurrentUser'](adminUser);
            this.closeModal.emit();
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('❌ [PersonaModal] Error con API, usando admin directamente:', error);
          this.isLoading.set(false);
          // Fallback: usar el admin directamente sin API
          this.authService['setCurrentUser'](adminUser);
          this.closeModal.emit();
          this.router.navigate(['/dashboard']);
        }
      });
    } else {
      console.warn('⚠️ [PersonaModal] No hay usuario admin, creando uno por defecto');
      this.createDefaultAdmin();
      // Intentar de nuevo después de crear el admin
      setTimeout(() => this.close(), 100);
    }
  }

  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'stakeholder': 'Stakeholder',
      'project_manager': 'Jefe de Proyectos',
      'developer': 'Desarrollador',
      'security_analyst': 'Analista de Seguridad',
      'ciso': 'CISO',
      'compliance_officer': 'Oficial de Cumplimiento',
      'incident_responder': 'Especialista en Incidentes'
    };
    return roleNames[role] || role;
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'stakeholder': 'bg-orange-500',
      'project_manager': 'bg-blue-500',
      'developer': 'bg-green-500',
      'security_analyst': 'bg-red-500',
      'ciso': 'bg-purple-500',
      'compliance_officer': 'bg-emerald-500',
      'incident_responder': 'bg-yellow-500'
    };
    return colors[role] || 'bg-gray-500';
  }

  getTooltipText(user: User): string {
    const scenarios: { [key: string]: string } = {
      'stakeholder': `Simula la experiencia de un stakeholder académico que necesita analizar métricas estudiantiles y seguimiento de proyectos. Acceso limitado a datos y reportes específicos de su área.`,
      'project_manager': `Simula la experiencia de un jefe de proyectos TI que gestiona múltiples iniciativas institucionales. Acceso completo a gestión de proyectos, datos analíticos y herramientas CMS.`,
      'developer': `Simula la experiencia de un desarrollador full-stack enfocado en CMS y gestión de contenido. Acceso a herramientas de desarrollo y administración de contenido web.`,
      'security_analyst': `Simula la experiencia de un analista de ciberseguridad que monitorea amenazas y vulnerabilidades. Acceso especializado en módulos de seguridad y análisis de datos.`,
      'ciso': `Simula la experiencia del Chief Information Security Officer con vista ejecutiva de ciberseguridad. Acceso a estrategia de seguridad, compliance y reportes ejecutivos.`,
      'compliance_officer': `Simula la experiencia de un oficial de cumplimiento especializado en marcos normativos. Acceso a auditorías, compliance ISO 27001 y reportes de cumplimiento.`,
      'incident_responder': `Simula la experiencia de un especialista en respuesta a incidentes. Acceso a herramientas forenses, análisis de malware y gestión de crisis de seguridad.`
    };
    return scenarios[user.role] || 'Usuario de demostración';
  }

  getAdminTooltipText(): string {
    return 'Simula la experiencia del administrador del sistema con acceso completo a todos los módulos: Ciberseguridad, Proyectos, CMS, Datos y Dashboards ejecutivos. Ideal para demostraciones completas del sistema.';
  }
}
