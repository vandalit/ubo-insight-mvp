import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  // Styles handled by global SCSS system
})
export class NavbarComponent {
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  openMesaAyuda() {
    // Aquí se implementará la lógica para abrir la mesa de ayuda
    console.log('Abriendo Mesa de Ayuda...');
    // Por ahora, podemos simular una redirección o modal
    window.open('mailto:ayuda@ubo.cl', '_blank');
  }
}
