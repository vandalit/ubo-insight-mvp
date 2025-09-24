import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget: number;
  spent: number;
  progress_percentage: number;
  start_date: string;
  end_date: string;
  manager_id: string;
  manager_name?: string;
  team_size?: number;
  created_at: string;
  updated_at: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  priority: string;
  budget: number;
  start_date: string;
  end_date: string;
}

@Component({
  selector: 'app-projects-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-management.component.html',
  styleUrls: ['./projects-management.component.css']
})
export class ProjectsManagementComponent implements OnInit {
  projects = signal<Project[]>([]);
  isLoading = signal(false);
  showCreateModal = signal(false);
  showEditModal = signal(false);
  selectedProject = signal<Project | null>(null);
  
  formData = signal<ProjectFormData>({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    budget: 0,
    start_date: '',
    end_date: ''
  });

  statusOptions = [
    { value: 'planning', label: 'Planificación' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'on-hold', label: 'En Pausa' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading.set(true);
    // TODO: Implementar llamada a API real cuando esté lista
    // Por ahora simulamos datos
    setTimeout(() => {
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'UBO Insight MVP',
          description: 'Desarrollo de plataforma integral de análisis y gestión de contenido',
          status: 'in-progress',
          priority: 'high',
          budget: 150000,
          spent: 75000,
          progress_percentage: 65,
          start_date: '2024-01-15',
          end_date: '2024-06-30',
          manager_id: '2',
          manager_name: 'María Rodríguez',
          team_size: 4,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-20T00:00:00Z'
        },
        {
          id: '2',
          name: 'Sistema de Ciberseguridad',
          description: 'Implementación de sistema de monitoreo y respuesta a incidentes',
          status: 'planning',
          priority: 'critical',
          budget: 200000,
          spent: 0,
          progress_percentage: 10,
          start_date: '2024-03-01',
          end_date: '2024-12-31',
          manager_id: '2',
          manager_name: 'María Rodríguez',
          team_size: 3,
          created_at: '2024-02-01T00:00:00Z',
          updated_at: '2024-02-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Portal Institucional',
          description: 'Rediseño completo del portal web institucional',
          status: 'completed',
          priority: 'medium',
          budget: 80000,
          spent: 78000,
          progress_percentage: 100,
          start_date: '2023-09-01',
          end_date: '2023-12-15',
          manager_id: '2',
          manager_name: 'María Rodríguez',
          team_size: 2,
          created_at: '2023-09-01T00:00:00Z',
          updated_at: '2023-12-15T00:00:00Z'
        }
      ];
      
      this.projects.set(mockProjects);
      this.isLoading.set(false);
      console.log('✅ [ProjectsManagement] Proyectos cargados:', mockProjects.length);
    }, 1000);
  }

  canManageProjects(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'project_manager';
  }

  openCreateModal() {
    this.resetForm();
    this.showCreateModal.set(true);
  }

  openEditModal(project: Project) {
    this.selectedProject.set(project);
    this.formData.set({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      budget: project.budget,
      start_date: project.start_date,
      end_date: project.end_date
    });
    this.showEditModal.set(true);
  }

  closeModals() {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.selectedProject.set(null);
    this.resetForm();
  }

  resetForm() {
    this.formData.set({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      budget: 0,
      start_date: '',
      end_date: ''
    });
  }

  createProject() {
    const form = this.formData();
    if (!form.name || !form.description) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    console.log('🔄 [ProjectsManagement] Creando proyecto:', form);
    
    // TODO: Implementar llamada a API real
    const newProject: Project = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      status: form.status as any,
      priority: form.priority as any,
      budget: form.budget,
      spent: 0,
      progress_percentage: 0,
      start_date: form.start_date,
      end_date: form.end_date,
      manager_id: this.authService.getCurrentUser()?.id || '',
      manager_name: this.authService.getCurrentUser()?.name || '',
      team_size: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const currentProjects = this.projects();
    this.projects.set([...currentProjects, newProject]);
    
    console.log('✅ [ProjectsManagement] Proyecto creado:', newProject.name);
    this.closeModals();
  }

  updateProject() {
    const form = this.formData();
    const project = this.selectedProject();
    
    if (!project || !form.name || !form.description) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    console.log('🔄 [ProjectsManagement] Actualizando proyecto:', project.id);
    
    // TODO: Implementar llamada a API real
    const updatedProject: Project = {
      ...project,
      name: form.name,
      description: form.description,
      status: form.status as any,
      priority: form.priority as any,
      budget: form.budget,
      start_date: form.start_date,
      end_date: form.end_date,
      updated_at: new Date().toISOString()
    };

    const currentProjects = this.projects();
    const updatedProjects = currentProjects.map(p => 
      p.id === project.id ? updatedProject : p
    );
    this.projects.set(updatedProjects);
    
    console.log('✅ [ProjectsManagement] Proyecto actualizado:', updatedProject.name);
    this.closeModals();
  }

  deleteProject(project: Project) {
    if (!confirm(`¿Está seguro de que desea eliminar el proyecto "${project.name}"?`)) {
      return;
    }

    console.log('🔄 [ProjectsManagement] Eliminando proyecto:', project.id);
    
    // TODO: Implementar llamada a API real
    const currentProjects = this.projects();
    const filteredProjects = currentProjects.filter(p => p.id !== project.id);
    this.projects.set(filteredProjects);
    
    console.log('✅ [ProjectsManagement] Proyecto eliminado:', project.name);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'planning': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CL');
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  }

  getStatusLabel(status: string): string {
    const statusOption = this.statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  }

  getPriorityLabel(priority: string): string {
    const priorityOption = this.priorityOptions.find(p => p.value === priority);
    return priorityOption ? priorityOption.label : priority;
  }
}
