<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# UBO Insight MVP

**Plataforma integral de servicios universitarios con documentación interactiva**

## Descripción del Proyecto

UBO Insight MVP es una Single Page Application (SPA) diseñada para centralizar y facilitar el acceso a los servicios digitales universitarios. La plataforma integra servicios académicos, ciberseguridad, noticias y comunicaciones institucionales en una interfaz moderna y responsive.

### ✨ Nuevas Funcionalidades de Documentación

- **📊 Status Page Institucional**: Página principal con monitoreo en tiempo real del sistema
- **🗺️ Sitemap Backend**: Generación automática de sitemap XML y representación ASCII
- **🎯 Sitemap Frontend**: Diagrama interactivo de flujo UX y mapeo completo de rutas Angular
- **🗄️ Database Visual**: Representación visual "Bento-style" del modelo de base de datos con dark schema
- **📚 Documentación Accesible**: Todos los archivos .md accesibles vía web con nombres normalizados

## Arquitectura y Decisiones Técnicas

### 1. Decisiones Base (MVP)

- **Frontend**: Angular 20 CSR (Client Side Rendering)
- **Change Detection**: Zoneless con `provideZonelessChangeDetection()`, Signals + AsyncPipe
- **Backend**: Laravel 11, API stateless, versión `/api/v1`
- **Base de Datos**: PostgreSQL (IDs UUID generados en app para portabilidad futura a SQL Server)
- **Respuestas API**: JSON con Laravel Resources
- **Infraestructura**: Nginx sirve Angular (estático) y enruta `/api` a Laravel (PHP-FPM)
- **Estilos**: Tailwind CSS 3.4
- **Sin integraciones**: Google/PowerBI/Zoho se implementarán posteriormente

### 2. Estructura del Proyecto

```
ubo-insight-mvp/
├── backend/ (Laravel 11)
│   ├── app/
│   ├── config/
│   ├── database/
│   └── routes/
└── frontend/ (Angular 20)
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   ├── shared/
    │   │   └── services/
    │   └── assets/
    │       └── data/ (JSON simulados)
```

## Funcionalidades Implementadas

### Páginas Principales

1. **Home**
   - Slider hero con 3 slides automáticos (5s)
   - Sección de métricas institucionales
   - Call-to-action para servicios

2. **Servicios**
   - Grid responsive de 6 servicios
   - Modal con carrusel para detalles
   - Botones configurables (login/redirect)

3. **Ciberseguridad**
   - Grid responsive de 5 elementos
   - Modal con carrusel para detalles
   - Políticas y procedimientos de seguridad

4. **Noticias**
   - Grid de artículos con categorías
   - Fechas y autores
   - Sistema de tags

5. **Diario Mural**
   - Avisos categorizados por tipo
   - Fechas de validez
   - Indicadores visuales por categoría

### Componentes Reutilizables

- **Card**: Componente para items con imagen, título, descripción y botón opcional
- **Grid**: Grids responsivos configurables (2, 3, 4 columnas)
- **Modal-Carousel**: Modal con navegación tipo carrusel entre items
- **Navbar**: Navegación responsive con menú móvil

## Estructura de Datos (JSON Simulados)

### Home
- `home-slides.json`: Slides del hero (id, title, subtitle, image, description)
- `home-metrics.json`: Métricas institucionales (id, title, value, icon, description)

### Servicios
- `servicios.json`: 6 servicios digitales
  - Biblioteca Digital
  - Campus Virtual
  - Sistema de Gestión Académica
  - Portal de Empleabilidad
  - Servicios Estudiantiles
  - Centro de Innovación

### Ciberseguridad
- `ciberseguridad.json`: 5 elementos de seguridad
  - Políticas de Seguridad
  - Capacitación en Ciberseguridad
  - Centro de Respuesta a Incidentes (CERT)
  - Auditorías de Seguridad
  - Gestión de Identidades

### Comunicaciones
- `noticias.json`: Noticias institucionales (id, title, summary, content, image, date, category, author)
- `diario-mural.json`: Avisos y comunicados (id, title, content, type, date, validUntil)

## Lógica de Producto

### Sistema de Navegación
- Navbar responsive con menú hamburguesa en móvil
- Rutas configuradas con Angular Router
- Estados activos visuales en navegación

### Sistema de Botones Configurables
Los servicios incluyen botones con acciones configurables:
- `login`: Redirecciona a sistema de autenticación
- `redirect:/ruta`: Redirecciona a URL específica
- Sin botón: Solo modal informativo

### Modal-Carrusel
- Navegación entre items con flechas
- Indicadores de posición
- Cierre con backdrop o botón X
- Responsive y accesible

### Categorización Visual
- **Diario Mural**: Colores por tipo (importante=rojo, mantencion=amarillo, evento=verde, politica=azul)
- **Noticias**: Tags por categoría (Tecnología, Empleabilidad, Académico)

## Instalación y Desarrollo

### Prerrequisitos
- Node.js 20+
- PHP 8.2+
- Composer
- Angular CLI

### Frontend (Angular)
```bash
cd frontend
npm install
ng serve --host 0.0.0.0 --port 4200
```

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve --host=0.0.0.0 --port=8000
```

## Roadmap y Próximas Funcionalidades

### Fase 1 (Actual - MVP)
- Estructura base Angular + Laravel
- Componentes principales y navegación
- Datos simulados en JSON
- Debug de renderizado de componentes
- Implementación zoneless con signals

### Fase 2 (CMS y Backend)
- Vista "Datos" para edición de JSONs
- APIs REST en Laravel
- Sistema de autenticación
- CMS para gestión de contenido
- Base de datos PostgreSQL

### Fase 3 (Integraciones)
- Sistema de login institucional
- Integración con Google Workspace
- Dashboard con PowerBI
- Integración Zoho

### Fase 4 (Optimización)
- SSR/SSG con Angular Universal
- PWA capabilities
- Optimización de performance
- Testing automatizado

## Estado Actual del Desarrollo

### Completado 
- Estructura base del proyecto
- Componentes principales implementados
- Sistema de navegación
- Datos simulados estructurados
- Diseño responsive con Tailwind CSS

### En Desarrollo 
- Debug de renderizado de grid y cards
- Migración a zoneless change detection
- Expansión de estructura de datos para CMS

### Pendiente 
- Vista de administración de datos
- Conexión con backend Laravel
- Sistema de autenticación
- CMS completo

## Notas Técnicas

### Estructura de Datos para CMS
Los JSONs están diseñados para ser fácilmente editables desde una futura interfaz CMS:
- IDs únicos para cada elemento
- Campos de texto editables
- Metadatos (fechas, categorías, estados)
- Configuración de botones y acciones
- Placeholders para imágenes y contenido multimedia

### Consideraciones de Escalabilidad
- UUIDs preparados para migración a SQL Server
- Estructura de APIs versionadas (/api/v1)
- Componentes modulares y reutilizables
- Separación clara entre datos y presentación

## 📚 Documentación Interactiva

### 🌐 Status Page - Documentación en Vivo
Accede a la documentación interactiva desde la página principal del sistema:

**URL**: `http://localhost:8000` (Backend Laravel)

#### Secciones Disponibles:

**🗺️ Sitemap Backend**
- **XML Sitemap**: `/sitemap.xml` - Sitemap estándar para SEO
- **ASCII Representation**: Visualización en texto de la estructura del sitio
- Generación automática basada en rutas Laravel

**🎯 Sitemap Frontend** 
- **Diagrama de Flujo UX**: Visualización interactiva del journey del usuario
- **Rutas Angular**: Mapeo completo de las 22 rutas configuradas
- **Diagrama Visual**: Flowchart estilo arquitectura de información
- Flujo simplificado sin "Persona Modal" (característica demo)

**🗄️ Database Visual**
- **Vista Bento**: `/database/visual` - Representación visual del modelo de BD
- **Dark Schema**: Interfaz con colores flat y tema oscuro
- **ASCII Database**: Representación en texto de las tablas
- **Schema JSON**: Estructura completa en formato JSON

### 📖 Documentación Técnica Completa

- **[📖 Documentación Técnica](./documentacion.md)** - Guía completa con enfoque pedagógico y académico
- **[📋 Glosario Técnico](./glosario.md)** - Anexo con definiciones y términos
- **[🗺️ Mapa del Proyecto](./mapa.md)** - Roadmap y decisiones arquitectónicas
- **[⚠️ Warnings](./warnings.md)** - Sistema de detección de conflictos
- **[🤖 Context](./context.md)** - Contexto para desarrollo futuro
- **[🗄️ Base de Datos](./basededatos.md)** - Modelo y lógica de BD

### 🔗 Acceso Web a Documentación
Todos los archivos están accesibles vía web:
- `/docs/warnings` - warnings.md
- `/docs/context` - context.md  
- `/docs/mapa` - mapa.md
- `/docs/database` - basededatos.md

---

*Versión: MVP 1.0*
