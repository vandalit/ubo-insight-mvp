import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-institutional',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  // Styles handled by global SCSS system
})
export class NavbarInstitutionalComponent {
  private router = inject(Router);
  
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  openMesaAyuda() {
    // Implementación mejorada para Mesa de Ayuda
    console.log('Abriendo Mesa de Ayuda...');
    
    // Opción 1: Abrir email
    const emailSubject = encodeURIComponent('Solicitud de Ayuda - UBO Insight');
    const emailBody = encodeURIComponent('Hola,\n\nNecesito ayuda con:\n\n[Describe tu consulta aquí]\n\nGracias.');
    window.open(`mailto:ayuda@ubo.cl?subject=${emailSubject}&body=${emailBody}`, '_blank');
    
    // Cerrar menú móvil si está abierto
    this.closeMobileMenu();
  }
}
