import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface ProjectMetric {
  id: string;
  title: string;
  value: number;
  trend: number;
  period: string;
  icon: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  manager: string;
  team: number;
  priority: string;
}

@Component({
  selector: 'app-proyectos-dashboard',
  imports: [CommonModule],
  templateUrl: './proyectos-dashboard.component.html',
  styleUrls: ['./proyectos-dashboard.component.css']
})
export class ProyectosDashboardComponent implements OnInit {
  metrics = signal<ProjectMetric[]>([]);
  projects = signal<Project[]>([]);
  isLoading = signal(true);
  currentDate = new Date();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.http.get<any>('assets/data/mock-analytics/proyectos-data.json').subscribe({
      next: (data) => {
        this.metrics.set(data.metrics);
        this.projects.set(data.projects);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading projects data:', error);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getMetricColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500'
    };
    return colorMap[color] || 'bg-gray-500';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'planning': 'bg-yellow-100 text-yellow-800',
      'on-hold': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityClass(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return priorityMap[priority] || 'bg-gray-100 text-gray-800';
  }

  getProgressBarColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  }
}
