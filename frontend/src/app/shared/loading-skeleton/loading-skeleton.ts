import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  imports: [CommonModule],
  templateUrl: './loading-skeleton.html',
  // Styles handled by global SCSS system
})
export class LoadingSkeletonComponent {
  @Input() type: 'hero' | 'card' | 'metric' = 'card';
  @Input() count: number = 1;
  @Input() height: string = '200px';
  @Input() width: string = '100%';

  get skeletonArray() {
    return Array(this.count).fill(0);
  }
}
