import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DetailItem {
  id: number;
  title: string;
  image: string;
  description: string;
  details: string;
  hasButton: boolean;
  buttonText: string;
  buttonAction: string;
}

@Component({
  selector: 'app-detail-view',
  imports: [CommonModule],
  templateUrl: './detail-view.html',
  // Styles handled by global SCSS system
})
export class DetailViewComponent implements OnInit {
  @Input() items: DetailItem[] = [];
  @Input() selectedIndex: number = 0;
  @Output() closeDetail = new EventEmitter<void>();
  @Output() itemAction = new EventEmitter<{action: string, item: DetailItem}>();

  currentIndex: number = 0;

  ngOnInit() {
    this.currentIndex = this.selectedIndex;
  }

  get currentItem(): DetailItem | null {
    return this.items[this.currentIndex] || null;
  }

  close() {
    this.closeDetail.emit();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
  }

  onButtonClick() {
    if (this.currentItem && this.currentItem.hasButton) {
      this.itemAction.emit({
        action: this.currentItem.buttonAction,
        item: this.currentItem
      });
    }
  }

  isExternalLink(url: string): boolean {
    return /^https?:\/\//.test(url);
  }
}
