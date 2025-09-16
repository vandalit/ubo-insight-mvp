import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface SecurityMetric {
  id: string;
  title: string;
  value: number;
  trend: number;
  period: string;
  icon: string;
  color: string;
}

interface SecurityAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

@Component({
  selector: 'app-ciberseguridad-dashboard',
  imports: [CommonModule],
  templateUrl: './ciberseguridad-dashboard.component.html',
  styleUrls: ['./ciberseguridad-dashboard.component.css']
})
export class CiberseguridadDashboardComponent implements OnInit {
  metrics = signal<SecurityMetric[]>([]);
  alerts = signal<SecurityAlert[]>([]);
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
    this.http.get<any>('assets/data/mock-analytics/ciberseguridad-data.json').subscribe({
      next: (data) => {
        this.metrics.set(data.metrics);
        this.alerts.set(data.alerts);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading security data:', error);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getMetricColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500'
    };
    return colorMap[color] || 'bg-gray-500';
  }

  getAlertTypeClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return typeMap[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
