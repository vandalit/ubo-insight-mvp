import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

export interface Metric {
  id: number;
  title: string;
  value: string;
  icon: string;
  description: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  image: string;
  description: string;
  details: string;
  hasButton: boolean;
  buttonText: string;
  buttonAction: string;
}

export interface Noticia {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

export interface DiarioItem {
  id: number;
  title: string;
  content: string;
  type: string;
  date: string;
  validUntil: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getHomeSlides(): Observable<Slide[]> {
    return this.http.get<Slide[]>('assets/data/home-slides.json');
  }

  getHomeMetrics(): Observable<Metric[]> {
    return this.http.get<Metric[]>('assets/data/home-metrics.json');
  }

  getServicios(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>('assets/data/servicios.json');
  }

  getCiberseguridad(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>('assets/data/ciberseguridad.json');
  }

  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>('assets/data/noticias.json');
  }

  getDiarioMural(): Observable<DiarioItem[]> {
    return this.http.get<DiarioItem[]>('assets/data/diario-mural.json');
  }
}
