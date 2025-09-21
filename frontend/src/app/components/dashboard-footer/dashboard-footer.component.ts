import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-footer.component.html',
  styleUrls: ['./dashboard-footer.component.scss']
})
export class DashboardFooterComponent {
  currentYear = new Date().getFullYear();
  
  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToModule(module: string): void {
    this.router.navigate([`/modules/${module}`]);
  }

  openExternalLink(url: string): void {
    window.open(url, '_blank');
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}
