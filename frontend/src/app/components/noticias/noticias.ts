import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Noticia } from '../../services/data';

@Component({
  selector: 'app-noticias',
  imports: [CommonModule],
  templateUrl: './noticias.html',
  // Styles handled by global SCSS system
})
export class NoticiasComponent implements OnInit {
  noticias: Noticia[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadNoticias();
  }

  loadNoticias() {
    this.dataService.getNoticias().subscribe(noticias => {
      this.noticias = noticias;
    });
  }
}
