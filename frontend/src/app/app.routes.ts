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
import { HomeContentComponent } from './modules/cms/home-content/home-content.component';
import { ServicesContentComponent } from './modules/cms/services-content/services-content.component';
import { NewsContentComponent } from './modules/cms/news-content/news-content.component';
import { DiarioMuralContentComponent } from './modules/cms/diario-mural-content/diario-mural-content.component';

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
  
  // CMS Sub-routes
  { path: 'modules/cms/home', component: HomeContentComponent },
  { path: 'modules/cms/services', component: ServicesContentComponent },
  { path: 'modules/cms/news', component: NewsContentComponent },
  { path: 'modules/cms/diario-mural', component: DiarioMuralContentComponent },
  
  // Fallback
  { path: '**', redirectTo: '/home' }
];
