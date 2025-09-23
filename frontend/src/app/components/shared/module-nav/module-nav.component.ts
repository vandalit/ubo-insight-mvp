import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export interface ModuleNavItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  badge?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-module-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './module-nav.component.html',
  styleUrls: ['./module-nav.component.scss']
})
export class ModuleNavComponent {
  @Input() moduleTitle: string = '';
  @Input() moduleIcon: string = '';
  @Input() navItems: ModuleNavItem[] = [];
  @Input() showBackButton: boolean = true;
  
  activeItemId = signal<string>('');

  constructor(private router: Router) {}

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToItem(item: ModuleNavItem): void {
    if (!item.disabled) {
      this.activeItemId.set(item.id);
      this.router.navigate([item.route]);
    }
  }

  isActiveItem(item: ModuleNavItem): boolean {
    return this.router.url.includes(item.route);
  }
}
