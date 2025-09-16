import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Slide, Metric } from '../../services/data';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  // Styles handled by global SCSS system
})
export class HomeComponent implements OnInit {
  slides: Slide[] = [];
  metrics: Metric[] = [];
  currentSlide = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadSlides();
    this.loadMetrics();
    this.startSlideShow();
  }

  loadSlides() {
    this.dataService.getHomeSlides().subscribe(slides => {
      this.slides = slides;
    });
  }

  loadMetrics() {
    this.dataService.getHomeMetrics().subscribe(metrics => {
      this.metrics = metrics;
    });
  }

  startSlideShow() {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambiar slide cada 5 segundos
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
