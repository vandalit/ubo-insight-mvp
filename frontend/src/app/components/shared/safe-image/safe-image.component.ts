import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-safe-image',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="safe-image-container" [style.width]="width" [style.height]="height">
      <!-- Imagen real -->
      <img 
        *ngIf="!showFallback && imageUrl"
        [src]="imageUrl" 
        [alt]="alt"
        [class]="imageClass"
        (load)="onImageLoad()"
        (error)="onImageError()"
        class="safe-image"
      />
      
      <!-- Fallback con gradiente -->
      <div 
        *ngIf="showFallback"
        class="image-fallback"
        [style.width]="width"
        [style.height]="height"
        [style.border-radius]="borderRadius"
      >
        <div class="fallback-content">
          <div class="fallback-icon" *ngIf="fallbackIcon">{{ fallbackIcon }}</div>
          <div class="fallback-text" *ngIf="fallbackText">{{ fallbackText }}</div>
          <div class="fallback-subtext">{{ fallbackSubtext }}</div>
        </div>
        <div class="shine-effect"></div>
      </div>
      
      <!-- Loading skeleton -->
      <div 
        *ngIf="isLoading && !showFallback"
        class="image-skeleton"
        [style.width]="width"
        [style.height]="height"
        [style.border-radius]="borderRadius"
      >
        <div class="skeleton-content">
          <div class="skeleton-icon">📸</div>
          <div class="skeleton-text">Cargando...</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .safe-image-container {
      position: relative;
      display: inline-block;
      overflow: hidden;
    }
    
    .safe-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }
    
    .image-fallback {
      background: linear-gradient(135deg, #0d2c5b 0%, #1a4480 30%, #2563eb 70%, #3b82f6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .fallback-content {
      text-align: center;
      z-index: 2;
      position: relative;
    }
    
    .fallback-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      opacity: 0.9;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .fallback-text {
      font-size: 1.1rem;
      font-weight: 600;
      opacity: 0.95;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .fallback-subtext {
      font-size: 0.75rem;
      opacity: 0.7;
      font-weight: 400;
    }
    
    .shine-effect {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      animation: shine 4s ease-in-out infinite;
      z-index: 1;
    }
    
    .image-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }
    
    .skeleton-content {
      text-align: center;
      opacity: 0.6;
    }
    
    .skeleton-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .skeleton-text {
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    @keyframes shine {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
    
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Responsive adjustments */
    @media (max-width: 640px) {
      .fallback-icon {
        font-size: 2rem;
      }
      
      .fallback-text {
        font-size: 1rem;
      }
      
      .fallback-subtext {
        font-size: 0.7rem;
      }
    }
  `]
})
export class SafeImageComponent implements OnInit {
  @Input() imageUrl: string = '';
  @Input() alt: string = 'Imagen';
  @Input() width: string = '100%';
  @Input() height: string = '200px';
  @Input() borderRadius: string = '0.5rem';
  @Input() imageClass: string = '';
  @Input() fallbackIcon: string = '🏛️';
  @Input() fallbackText: string = 'UBO Insight';
  @Input() fallbackSubtext: string = 'Imagen no disponible';
  @Input() loadTimeout: number = 8000; // 8 segundos timeout

  showFallback = false;
  isLoading = true;
  private timeoutId?: number;

  ngOnInit() {
    console.log('🖼️ [SafeImage] Initializing with URL:', this.imageUrl);
    
    // Si no hay URL, mostrar fallback inmediatamente
    if (!this.imageUrl || this.imageUrl.trim() === '') {
      console.log('🖼️ [SafeImage] No URL provided, showing fallback');
      this.showFallback = true;
      this.isLoading = false;
      return;
    }

    // Configurar timeout para carga de imagen
    this.timeoutId = window.setTimeout(() => {
      if (this.isLoading) {
        console.log('⏰ [SafeImage] Load timeout reached, showing fallback');
        this.showFallback = true;
        this.isLoading = false;
      }
    }, this.loadTimeout);
  }

  onImageLoad() {
    console.log('✅ [SafeImage] Image loaded successfully:', this.imageUrl);
    this.isLoading = false;
    this.showFallback = false;
    this.clearTimeout();
  }

  onImageError() {
    console.log('❌ [SafeImage] Image failed to load:', this.imageUrl);
    this.isLoading = false;
    this.showFallback = true;
    this.clearTimeout();
  }

  private clearTimeout() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  ngOnDestroy() {
    this.clearTimeout();
  }
}
