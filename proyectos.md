# UBO Insight MVP - Abstract del Proyecto

## 📋 Información General

**Proyecto:** UBO Insight MVP  
**Institución:** Universidad Bernardo O'Higgins (UBO)  
**Tipo:** Single Page Application (SPA) - Plataforma Integral de Servicios Universitarios  
**Estado:** FASE AVANZADA - Backend + Frontend Integrados + Dashboard Prototipo  
**Objetivo:** Centralizar servicios digitales universitarios con sistema de gestión integral y dashboards ejecutivos  

---

## 🏗️ Arquitectura Tecnológica

### Frontend
- **Framework:** Angular 20.1.0
- **Arquitectura:** Client Side Rendering (CSR)
- **Change Detection:** Zoneless con `provideZonelessChangeDetection()` + Signals
- **CLI:** Angular CLI 20.1.6
- **Estilos:** Tailwind CSS 3.4.0 + SCSS personalizado
- **TypeScript:** 5.8.2
- **Node.js:** 20+

### Backend
- **Framework:** Laravel 12.0 (Framework más reciente)
- **PHP:** 8.2+
- **API:** RESTful stateless, versionada `/api/v1`
- **Respuestas:** JSON con Laravel Resources
- **Composer:** Gestión de dependencias PHP

### Base de Datos
- **Desarrollo:** PostgreSQL (sintaxis compatible con SQL Server)
- **Producción Futura:** SQL Server (migración planificada)
- **IDs:** UUIDs generados en aplicación para portabilidad
- **ORM:** Eloquent (Laravel)

### Infraestructura
- **Servidor Web:** Nginx
- **Procesamiento PHP:** PHP-FPM
- **Enrutamiento:** Nginx sirve Angular estático + proxy `/api` a Laravel
- **Despliegue:** Heroku (MVP) → Infraestructura corporativa (Producción)

---

## 📦 Dependencias Principales

### Frontend (package.json)
```json
{
  "dependencies": {
    "@angular/common": "^20.1.0",
    "@angular/compiler": "^20.1.0", 
    "@angular/core": "^20.1.0",
    "@angular/forms": "^20.1.0",
    "@angular/platform-browser": "^20.1.0",
    "@angular/router": "^20.1.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  },
  "devDependencies": {
    "@angular/build": "^20.1.6",
    "@angular/cli": "^20.1.6",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^3.4.0",
    "typescript": "~5.8.2"
  }
}
```

### Backend (composer.json)
```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^12.0",
    "laravel/tinker": "^2.10.1"
  },
  "require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pail": "^1.2.2",
    "laravel/pint": "^1.24",
    "laravel/sail": "^1.41",
    "phpunit/phpunit": "^11.5.3"
  }
}
```

---

## 🗂️ Estructura del Proyecto

```
ubo-insight-mvp/
├── 📁 app/                    # Laravel Backend
│   ├── Http/Controllers/
│   ├── Models/
│   └── Resources/
├── 📁 frontend/               # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Páginas principales
│   │   │   ├── shared/        # Componentes reutilizables
│   │   │   └── services/      # Servicios Angular
│   │   ├── assets/
│   │   │   ├── data/          # 🔑 JSONs simulados
│   │   │   └── images/
│   │   └── styles/            # Sistema SCSS organizado
├── 📁 database/               # Migraciones y Seeders
├── 📁 routes/                 # Rutas API Laravel
├── 📄 proyectos.md           # Este archivo
├── 📄 basededatos.md         # Modelo de BD (siguiente)
└── 📄 README.md              # Documentación principal
```

---

## 🎯 Funcionalidades Implementadas

### 1. Páginas Principales (100% MIGRADAS A API)
- **Home:** Slider hero + métricas institucionales (API: /home/slides, /home/metrics)
- **Servicios:** Grid de 6 servicios con DetailView (API: /services)
- **Ciberseguridad:** Grid de 5 elementos con detalles (API: /cybersecurity)
- **Noticias:** Sistema de artículos con tags y categorías (API: /news, /news-featured)
- **Diario Mural:** Avisos institucionales por tipo (API: /bulletin-board)
- **Dashboard:** Prototipo ejecutivo con Chart.js (4 gráficos + KPIs)

### 2. Componentes Reutilizables
- **Card:** Items con imagen, título, descripción, botón opcional
- **Grid:** Grids responsivos configurables (compatible con ServiceItem)
- **DetailView:** Vista detalle con navegación tipo carrusel (reemplaza modal-carousel)
- **LoadingSkeleton:** Estados de carga con animaciones shimmer
- **Navbar:** Navegación responsive con menú móvil + enlace Dashboard
- **SafeImage:** Sistema de imágenes con fallbacks UBO branding

### 3. Sistema de APIs REST (Laravel + PostgreSQL)
- **15 Tablas:** Con UUIDs, relaciones, índices optimizados
- **Seeders:** Datos realistas para departamento TI universitario
- **Controllers:** HomeController, ServiceController, NewsController, etc.
- **Middleware:** CORS, debug info, error handling
- **Transformación:** Compatibilidad frontend (image_url → image)

### 3. Sistema de Datos Simulados

#### Estructura JSON Principal
```typescript
// Servicios (servicios.json)
interface ServiceItem {
  id: number;
  title: string;
  image: string;
  description: string;
  details: string;
  hasButton: boolean;
  buttonText: string;
  buttonAction: string; // 'login' | 'mailto:...' | 'redirect:...'
}

// Noticias (noticias.json)
interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

// Usuarios (usuarios.json)
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'developer' | 'project_manager' | 'stakeholder';
  permissions: string[];
  avatar: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}
```

#### Mock Analytics
- **Ciberseguridad:** Métricas de seguridad, incidentes, auditorías
- **Proyectos:** Dashboard de proyectos, presupuestos, equipos

---

## 🔄 Flujos de Usuario

### 1. Navegación Principal
```
Home → [Servicios|Ciberseguridad|Noticias|Diario Mural]
```

### 2. Interacción con Servicios
```
Grid de Servicios → Click Card → DetailView → [Acción de Botón|Navegación]
```

### 3. Sistema de Botones Configurables
- **login:** Redirección a autenticación
- **mailto:** Apertura de cliente email
- **redirect:** Navegación a URL específica
- **Sin botón:** Solo información

### 4. Futuro Sistema de Módulos
```
Login → Router de Módulos → [Ciberseguridad|Proyectos|CMS & Datos]
```

---

## 🎨 Sistema de Diseño

### Colores Corporativos UBO
- **Primario:** `#0d2c5b` (Azul UBO)
- **Secundario:** `#f39c12` (Naranja UBO)
- **Backgrounds:** `#ffffff`, `#f8f9fa`, `#f1f3f4`

### Componentes de UI
- **Border Radius:** 12px (lg), 16px (xl) - basado en referente UBO TiApp
- **Sombras:** Sistema de elevación con doble capa
- **Tipografía:** Sistema escalable responsive
- **Grid:** 2-3-4 columnas según breakpoint

---

## 📊 Consideraciones de Base de Datos

### Estrategia de Migración
1. **Desarrollo:** PostgreSQL con sintaxis estándar SQL
2. **IDs:** UUIDs para portabilidad entre SGBD
3. **Producción:** Migración a SQL Server empresarial
4. **Compatibilidad:** Uso de Eloquent ORM para abstracción

### Datos Actuales (JSON → BD)
- **Contenido Público:** Servicios, noticias, diario mural
- **Usuarios:** Sistema de roles y permisos
- **Analytics:** Métricas de ciberseguridad y proyectos
- **CMS:** Gestión de contenido editable

---

## 🚀 Roadmap de Desarrollo

### ✅ Fase 1 COMPLETADA (MVP Base)
- ✅ Estructura base Angular + Laravel
- ✅ Componentes principales implementados
- ✅ Datos simulados en JSON
- ✅ Base de datos PostgreSQL definida e implementada

### ✅ Fase 2 COMPLETADA (Backend & BD)
- ✅ Migración JSON → PostgreSQL (100% completada)
- ✅ APIs REST en Laravel (15 tablas, UUIDs, relaciones)
- ✅ Seeders con datos realistas para departamento TI
- ✅ Frontend integrado con ApiService (TypeScript interfaces)

### 🔄 Fase 3 EN PROGRESO (Módulos Avanzados)
- ✅ Dashboard Ejecutivo con Chart.js (4 tipos de gráficos)
- 🔲 Dashboard de Ciberseguridad (pendiente)
- 🔲 Dashboard de Servicios (pendiente)
- 🔲 Sistema de autenticación con Sanctum
- 🔲 CMS para gestión de contenido

### 🔲 Fase 4 (Producción)
- 🔲 Migración a SQL Server
- 🔲 Infraestructura corporativa
- 🔲 Integraciones empresariales
- 🔲 Optimización y testing

---

## 🔧 Comandos de Desarrollo

### Frontend
```bash
cd frontend
npm install
ng serve --host 0.0.0.0 --port 4200
```

### Backend
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan serve --host=0.0.0.0 --port=8000
```

### Base de Datos (Próximo)
```bash
php artisan migrate
php artisan db:seed
```

---

## 📝 Notas Críticas para Desarrollo

### Protección de Legacy Code
- **Componentes existentes:** Mantener funcionalidad actual
- **Rutas establecidas:** No modificar navegación principal
- **Datos JSON:** Preservar estructura durante migración BD
- **Estilos SCSS:** Mantener sistema de design tokens

### Criterios de Desarrollo
- **Compatibilidad SQL Server:** Sintaxis estándar, UUIDs
- **Escalabilidad:** Componentes modulares y reutilizables
- **Performance:** Lazy loading, change detection optimizada
- **Accesibilidad:** ARIA labels, navegación por teclado

### Suposiciones No Obvias
- **UUIDs en app:** Generación en aplicación, no en BD
- **Zoneless Angular:** Migración progresiva con signals
- **API versionada:** Preparación para múltiples versiones
- **CMS futuro:** Estructura JSON preparada para edición

---

**Última actualización:** Diciembre 2024  
**Rama de desarrollo:** `mindsurfer`  
**Responsable:** Equipo de Desarrollo UBO Insight
