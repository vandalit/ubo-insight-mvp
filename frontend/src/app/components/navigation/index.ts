// Navigation Components Barrel - UBO Insight MVP
// Exportaciones organizadas para componentes de navegación

import { NavbarInstitutionalComponent } from '../navbar/navbar';
import { NavbarInsightComponent } from '../shared/navbar-insight/navbar-insight.component';
import { FooterComponent } from '../footer/footer';
import { DashboardFooterComponent } from '../dashboard-footer/dashboard-footer.component';

// ===== NAVBARS =====
// Navbar institucional para sitio público y login
export { NavbarInstitutionalComponent };

// Navbar UBO Insight para dashboard y módulos
export { NavbarInsightComponent };

// ===== FOOTERS =====
// Footer institucional para sitio público
export { FooterComponent };

// Footer UBO Insight para dashboard y módulos
export { DashboardFooterComponent };

// ===== TIPOS DE NAVEGACIÓN =====
export type NavigationType = 'institutional' | 'insight';

// ===== CONFIGURACIÓN DE NAVEGACIÓN =====
export interface NavigationConfig {
  type: NavigationType;
  showBreadcrumbs?: boolean;
  showUserMenu?: boolean;
  showModuleSelector?: boolean;
}

// ===== UTILIDADES =====
export function getNavigationComponents(type: NavigationType) {
  switch (type) {
    case 'institutional':
      return {
        navbar: NavbarInstitutionalComponent,
        footer: FooterComponent
      };
    case 'insight':
      return {
        navbar: NavbarInsightComponent,
        footer: DashboardFooterComponent
      };
    default:
      throw new Error(`Unknown navigation type: ${type}`);
  }
}
