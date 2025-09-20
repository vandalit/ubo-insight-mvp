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
    // Cargar el usuario admin actual
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'admin') {
      this.adminUser.set(currentUser);
      console.log('👑 [PersonaModal] Usuario admin cargado:', currentUser.name);
    }
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
    console.log('👤 [PersonaModal] Usuario seleccionado:', user.name);
  }

  showConfirmModal() {
    if (!this.selectedUser()) return;
    this.showConfirmation.set(true);
    console.log('📋 [PersonaModal] Mostrando modal de confirmación');
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
          }
        },
        error: (error) => {
          console.error('❌ [PersonaModal] Error cargando admin:', error);
          this.closeModal.emit();
        }
      });
    } else {
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
    const roleColors: { [key: string]: string } = {
      'stakeholder': 'bg-orange-500',
      'project_manager': 'bg-blue-600',
      'developer': 'bg-green-600',
      'security_analyst': 'bg-red-600'
    };
    return roleColors[role] || 'bg-gray-500';
  }
}
