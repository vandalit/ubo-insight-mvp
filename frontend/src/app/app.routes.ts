import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ServiciosComponent } from './components/servicios/servicios';
import { CiberseguridadComponent } from './components/ciberseguridad/ciberseguridad';
import { NoticiasComponent } from './components/noticias/noticias';
import { DiarioMuralComponent } from './components/diario-mural/diario-mural';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'ciberseguridad', component: CiberseguridadComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'diario-mural', component: DiarioMuralComponent },
  { path: '**', redirectTo: '' }
];
