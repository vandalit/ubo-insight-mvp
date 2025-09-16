import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ServiciosComponent } from './components/servicios/servicios';
import { CiberseguridadComponent } from './components/ciberseguridad/ciberseguridad';
import { NoticiasComponent } from './components/noticias/noticias';
import { DiarioMuralComponent } from './components/diario-mural/diario-mural';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CiberseguridadDashboardComponent } from './modules/ciberseguridad/ciberseguridad-dashboard.component';
import { ProyectosDashboardComponent } from './modules/proyectos/proyectos-dashboard.component';
import { CMSDashboardComponent } from './modules/cms/cms-dashboard.component';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'ciberseguridad', component: CiberseguridadComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'diario-mural', component: DiarioMuralComponent },
  
  // Auth routes
  { path: 'login', component: LoginComponent },
  
  // Dashboard routes
  { path: 'dashboard', component: DashboardComponent },
  
  // Module routes
  { path: 'modules/ciberseguridad', component: CiberseguridadDashboardComponent },
  { path: 'modules/proyectos', component: ProyectosDashboardComponent },
  { path: 'modules/cms', component: CMSDashboardComponent },
  
  // Fallback
  { path: '**', redirectTo: '/home' }
];
