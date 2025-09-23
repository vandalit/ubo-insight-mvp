import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarInstitutionalComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarInstitutionalComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  // Styles handled by global SCSS system
})
export class AppComponent implements OnInit {
  title = 'UBO Insight MVP';
  showNavbarFooter = signal(true);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Ocultar navbar/footer en rutas de dashboard y login
      const hiddenRoutes = ['/login', '/dashboard', '/modules'];
      const shouldHide = hiddenRoutes.some(route => event.url.startsWith(route));
      this.showNavbarFooter.set(!shouldHide);
    });
  }
}
