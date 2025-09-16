import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, DiarioItem } from '../../services/data';

@Component({
  selector: 'app-diario-mural',
  imports: [CommonModule],
  templateUrl: './diario-mural.html',
  styleUrl: './diario-mural.css'
})
export class DiarioMuralComponent implements OnInit {
  items: DiarioItem[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadDiarioMural();
  }

  loadDiarioMural() {
    this.dataService.getDiarioMural().subscribe(items => {
      this.items = items;
    });
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'importante': return 'border-l-red-500 bg-red-50';
      case 'mantencion': return 'border-l-yellow-500 bg-yellow-50';
      case 'evento': return 'border-l-green-500 bg-green-50';
      case 'politica': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  }
}
