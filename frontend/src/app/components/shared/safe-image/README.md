# SafeImageComponent - Sistema de Imágenes Seguras

## 🎯 Propósito

El `SafeImageComponent` es un componente reutilizable que maneja automáticamente las imágenes que fallan al cargar, URLs vacías, o conexiones lentas. Muestra un fallback elegante con gradiente del color primario de UBO cuando las imágenes no están disponibles.

## ✨ Características

- **Fallback automático**: Gradiente azul UBO cuando la imagen falla
- **Loading skeleton**: Animación mientras carga la imagen
- **Timeout configurable**: Por defecto 8 segundos
- **Responsive**: Se adapta a cualquier tamaño
- **Personalizable**: Texto, icono y dimensiones configurables
- **Efecto shine**: Animación sutil en el fallback
- **Debug logs**: Información en consola para desarrollo

## 🚀 Uso Básico

```html
<!-- Uso simple -->
<app-safe-image 
  [imageUrl]="noticia.image_url"
  [alt]="noticia.title">
</app-safe-image>

<!-- Uso completo con todas las opciones -->
<app-safe-image 
  [imageUrl]="proyecto.imagen"
  [alt]="proyecto.nombre"
  width="300px"
  height="200px"
  borderRadius="1rem"
  fallbackIcon="🏗️"
  fallbackText="Proyecto UBO"
  fallbackSubtext="Imagen no disponible"
  [loadTimeout]="5000">
</app-safe-image>
```

## 📋 Parámetros

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `imageUrl` | string | `''` | URL de la imagen a cargar |
| `alt` | string | `'Imagen'` | Texto alternativo |
| `width` | string | `'100%'` | Ancho del contenedor |
| `height` | string | `'200px'` | Alto del contenedor |
| `borderRadius` | string | `'0.5rem'` | Radio de borde |
| `imageClass` | string | `''` | Clases CSS adicionales para la imagen |
| `fallbackIcon` | string | `'🏛️'` | Emoji/icono del fallback |
| `fallbackText` | string | `'UBO Insight'` | Texto principal del fallback |
| `fallbackSubtext` | string | `'Imagen no disponible'` | Texto secundario |
| `loadTimeout` | number | `8000` | Timeout en milisegundos |

## 🎨 Estados Visuales

### 1. Loading (Cargando)
- Skeleton animado gris
- Icono 📸 y texto "Cargando..."
- Animación shimmer

### 2. Success (Éxito)
- Imagen original mostrada
- Transición suave de opacidad

### 3. Fallback (Error/Sin imagen)
- Gradiente azul UBO (135deg)
- Icono y texto personalizables
- Efecto shine animado
- Sombra interna sutil

## 🌈 Gradiente UBO

El fallback usa el gradiente oficial de UBO:
```css
background: linear-gradient(135deg, 
  #0d2c5b 0%,    /* Azul primario UBO */
  #1a4480 30%,   /* Azul intermedio */
  #2563eb 70%,   /* Azul claro */
  #3b82f6 100%   /* Azul final */
);
```

## 📱 Responsive

El componente se adapta automáticamente:
- **Desktop**: Iconos y texto grandes
- **Mobile**: Iconos y texto más pequeños
- **Dimensiones**: Hereda del contenedor padre

## 🔧 Casos de Uso

### Noticias
```html
<app-safe-image 
  [imageUrl]="noticia.image_url"
  [alt]="noticia.title"
  fallbackIcon="📰"
  fallbackText="UBO Noticias"
  borderRadius="0.75rem">
</app-safe-image>
```

### Proyectos
```html
<app-safe-image 
  [imageUrl]="proyecto.imagen"
  [alt]="proyecto.nombre"
  fallbackIcon="🏗️"
  fallbackText="Proyecto UBO"
  width="100%"
  height="250px">
</app-safe-image>
```

### Servicios
```html
<app-safe-image 
  [imageUrl]="servicio.icono"
  [alt]="servicio.nombre"
  fallbackIcon="🛠️"
  fallbackText="Servicio UBO"
  width="64px"
  height="64px"
  borderRadius="50%">
</app-safe-image>
```

### Usuarios/Avatares
```html
<app-safe-image 
  [imageUrl]="usuario.avatar"
  [alt]="usuario.nombre"
  fallbackIcon="👤"
  fallbackText="Usuario"
  width="48px"
  height="48px"
  borderRadius="50%">
</app-safe-image>
```

## 🐛 Debug

El componente registra información útil en la consola:

```
🖼️ [SafeImage] Initializing with URL: https://example.com/image.jpg
✅ [SafeImage] Image loaded successfully: https://example.com/image.jpg
❌ [SafeImage] Image failed to load: https://broken-url.com/image.jpg
⏰ [SafeImage] Load timeout reached, showing fallback
```

## 🎯 Beneficios

1. **UX mejorada**: No más imágenes rotas
2. **Consistencia visual**: Fallback con branding UBO
3. **Performance**: Timeout evita esperas infinitas
4. **Accesibilidad**: Alt text y ARIA labels
5. **Mantenibilidad**: Componente reutilizable
6. **Debug**: Logs para desarrollo

## 🔄 Integración

Para usar en cualquier componente:

1. Importar el componente:
```typescript
import { SafeImageComponent } from '../shared/safe-image/safe-image.component';

@Component({
  imports: [CommonModule, SafeImageComponent],
  // ...
})
```

2. Usar en el template:
```html
<app-safe-image [imageUrl]="miImagen" [alt]="miTexto"></app-safe-image>
```

¡Listo! El componente manejará automáticamente todos los casos edge de las imágenes.
