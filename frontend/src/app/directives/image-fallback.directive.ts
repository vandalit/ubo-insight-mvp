import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective implements OnInit {
  @Input() appImageFallback: string = ''; // URL de la imagen
  @Input() fallbackText: string = 'UBO'; // Texto a mostrar en el fallback
  @Input() fallbackIcon: string = '🏛️'; // Icono a mostrar en el fallback

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setupImageHandling();
  }

  private setupImageHandling() {
    const img = this.el.nativeElement;
    
    // Configurar el src de la imagen
    if (this.appImageFallback && this.appImageFallback.trim() !== '') {
      this.renderer.setAttribute(img, 'src', this.appImageFallback);
    } else {
      // Si no hay URL, mostrar fallback inmediatamente
      this.showFallback();
      return;
    }

    // Manejar error de carga
    this.renderer.listen(img, 'error', () => {
      console.log('🖼️ [ImageFallback] Error loading image:', this.appImageFallback);
      this.showFallback();
    });

    // Manejar carga exitosa
    this.renderer.listen(img, 'load', () => {
      console.log('✅ [ImageFallback] Image loaded successfully:', this.appImageFallback);
      this.hideFallback();
    });

    // Timeout para imágenes que tardan mucho en cargar
    setTimeout(() => {
      if (!img.complete || img.naturalHeight === 0) {
        console.log('⏰ [ImageFallback] Image load timeout:', this.appImageFallback);
        this.showFallback();
      }
    }, 8000); // 8 segundos timeout
  }

  private showFallback() {
    const img = this.el.nativeElement;
    
    // Ocultar la imagen original
    this.renderer.setStyle(img, 'display', 'none');
    
    // Crear el contenedor fallback si no existe
    let fallbackContainer = img.nextElementSibling as HTMLElement;
    if (!fallbackContainer || !fallbackContainer.classList.contains('image-fallback')) {
      fallbackContainer = this.createFallbackContainer();
      const parent = img.parentNode;
      if (parent) {
        this.renderer.insertBefore(parent, fallbackContainer, img.nextSibling);
      }
    }
    
    // Mostrar el fallback
    this.renderer.setStyle(fallbackContainer, 'display', 'flex');
  }

  private hideFallback() {
    const img = this.el.nativeElement;
    const fallbackContainer = img.nextElementSibling as HTMLElement;
    
    // Mostrar la imagen original
    this.renderer.setStyle(img, 'display', 'block');
    
    // Ocultar el fallback si existe
    if (fallbackContainer && fallbackContainer.classList.contains('image-fallback')) {
      this.renderer.setStyle(fallbackContainer, 'display', 'none');
    }
  }

  private createFallbackContainer(): HTMLElement {
    const container = this.renderer.createElement('div');
    const img = this.el.nativeElement;
    
    // Copiar dimensiones de la imagen original
    const imgStyles = window.getComputedStyle(img);
    const width = imgStyles.width || '100%';
    const height = imgStyles.height || '200px';
    const borderRadius = imgStyles.borderRadius || '0px';
    
    // Aplicar clases y estilos
    this.renderer.addClass(container, 'image-fallback');
    this.renderer.setStyle(container, 'width', width);
    this.renderer.setStyle(container, 'height', height);
    this.renderer.setStyle(container, 'border-radius', borderRadius);
    this.renderer.setStyle(container, 'background', 'linear-gradient(135deg, #0d2c5b 0%, #1a4480 50%, #2563eb 100%)');
    this.renderer.setStyle(container, 'display', 'flex');
    this.renderer.setStyle(container, 'align-items', 'center');
    this.renderer.setStyle(container, 'justify-content', 'center');
    this.renderer.setStyle(container, 'flex-direction', 'column');
    this.renderer.setStyle(container, 'color', 'white');
    this.renderer.setStyle(container, 'font-family', 'system-ui, -apple-system, sans-serif');
    this.renderer.setStyle(container, 'position', 'relative');
    this.renderer.setStyle(container, 'overflow', 'hidden');
    
    // Crear el contenido del fallback
    const content = this.createFallbackContent();
    this.renderer.appendChild(container, content);
    
    // Agregar efecto de brillo sutil
    this.addShineEffect(container);
    
    return container;
  }

  private createFallbackContent(): HTMLElement {
    const content = this.renderer.createElement('div');
    this.renderer.setStyle(content, 'text-align', 'center');
    this.renderer.setStyle(content, 'z-index', '2');
    
    // Icono
    if (this.fallbackIcon) {
      const icon = this.renderer.createElement('div');
      this.renderer.setStyle(icon, 'font-size', '2.5rem');
      this.renderer.setStyle(icon, 'margin-bottom', '0.5rem');
      this.renderer.setStyle(icon, 'opacity', '0.9');
      this.renderer.setProperty(icon, 'textContent', this.fallbackIcon);
      this.renderer.appendChild(content, icon);
    }
    
    // Texto
    if (this.fallbackText) {
      const text = this.renderer.createElement('div');
      this.renderer.setStyle(text, 'font-size', '1.1rem');
      this.renderer.setStyle(text, 'font-weight', '600');
      this.renderer.setStyle(text, 'opacity', '0.95');
      this.renderer.setStyle(text, 'letter-spacing', '0.05em');
      this.renderer.setProperty(text, 'textContent', this.fallbackText);
      this.renderer.appendChild(content, text);
    }
    
    // Subtexto
    const subtext = this.renderer.createElement('div');
    this.renderer.setStyle(subtext, 'font-size', '0.75rem');
    this.renderer.setStyle(subtext, 'opacity', '0.7');
    this.renderer.setStyle(subtext, 'margin-top', '0.25rem');
    this.renderer.setProperty(subtext, 'textContent', 'Imagen no disponible');
    this.renderer.appendChild(content, subtext);
    
    return content;
  }

  private addShineEffect(container: HTMLElement) {
    const shine = this.renderer.createElement('div');
    this.renderer.setStyle(shine, 'position', 'absolute');
    this.renderer.setStyle(shine, 'top', '0');
    this.renderer.setStyle(shine, 'left', '-100%');
    this.renderer.setStyle(shine, 'width', '100%');
    this.renderer.setStyle(shine, 'height', '100%');
    this.renderer.setStyle(shine, 'background', 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)');
    this.renderer.setStyle(shine, 'animation', 'shine 3s ease-in-out infinite');
    this.renderer.setStyle(shine, 'z-index', '1');
    
    this.renderer.appendChild(container, shine);
    
    // Agregar keyframes CSS si no existen
    this.addShineKeyframes();
  }

  private addShineKeyframes() {
    const styleId = 'image-fallback-keyframes';
    if (!document.getElementById(styleId)) {
      const style = this.renderer.createElement('style');
      this.renderer.setProperty(style, 'id', styleId);
      this.renderer.setProperty(style, 'textContent', `
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `);
      this.renderer.appendChild(document.head, style);
    }
  }
}
