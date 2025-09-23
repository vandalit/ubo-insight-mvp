# UBO Insight MVP - Prompt Context para LLMs

## 🎯 CONDUCTA Y ALINEACIÓN REQUERIDA

### Principios Fundamentales
1. **PRESERVAR LEGACY CODE:** Nunca destruir funcionalidad existente sin consultar
2. **CONSULTAR DOCUMENTOS:** Siempre leer proyectos.md, basededatos.md y mapa.md antes de modificaciones importantes
3. **VERIFICAR COMPATIBILIDAD:** Usar mapa.md para detectar conflictos potenciales en decisiones
4. **MANTENER CONTEXTO:** Actualizar documentación con cada cambio significativo
5. **DISONANCIA COGNITIVA:** Verificar decisiones delicadas contra el mapa de implementaciones

### Archivos de Contexto OBLIGATORIOS
- **proyectos.md:** Abstract completo, estado actual, funcionalidades implementadas
- **basededatos.md:** Modelo de BD, lógica de negocio, decisiones de diseño
- **mapa.md:** Hoja de ruta completa, decisiones críticas, compatibilidad
- **DASHBOARD_PROPOSALS.md:** Propuestas de dashboards especializados

### Flujo de Trabajo Requerido
1. **ANTES de cualquier modificación importante:** Leer documentos de contexto
2. **DURANTE el desarrollo:** Verificar compatibilidad con implementaciones existentes
3. **DESPUÉS de cambios:** Actualizar documentación relevante

---

## 🏗️ ARQUITECTURA ACTUAL (CRÍTICA)

### Stack Tecnológico
- **Frontend:** Angular 20.1.0 + Tailwind CSS + SCSS
- **Backend:** Laravel 11 + PostgreSQL (UUIDs)
- **APIs:** REST versionadas /api/v1/* con Laravel Resources
- **Visualización:** Chart.js 4.0 + ng2-charts
- **Estado:** Zone.js (NO zoneless aún - migración pendiente)

### Estructura de Datos CRÍTICA
```typescript
// INTERFACES PRINCIPALES - NO MODIFICAR SIN VERIFICAR IMPACTO
interface ServiceItem {
  id: string;           // UUID (NO number)
  title: string;
  description: string;
  details: string;
  image: string;        // Mapeado de image_url en API
  hasButton: boolean;
  buttonText: string;
  buttonAction: string;
}

interface News {
  id: string;           // UUID
  title: string;
  content: string;
  excerpt: string;      // Mapeado de summary
  image_url: string;
  published_at: string; // Mapeado de date
  // ... más campos en basededatos.md
}
```

### Transformaciones de Datos CRÍTICAS
- **API → Frontend:** `image_url` → `image` (compatibilidad)
- **API → Frontend:** `published_at` → `date` (en algunos casos)
- **API → Frontend:** `excerpt` ↔ `summary` (bidireccional)
- **IDs:** Siempre UUIDs string, nunca numbers

---

## 🔄 MIGRACIONES COMPLETADAS

### Estado Actual (NO RETROCEDER)
- ✅ **Home:** 100% migrado a API (slides + metrics)
- ✅ **Services:** 100% migrado con service_actions
- ✅ **Cybersecurity:** 100% migrado como cybersecurity_items
- ✅ **News:** 100% migrado con tags y categories
- ✅ **BulletinBoard:** 100% migrado con tipos
- ✅ **Dashboard:** Prototipo Chart.js funcional

### APIs Funcionando (NO ROMPER)
```bash
GET /api/v1/home/slides          # 3 slides hero
GET /api/v1/home/metrics         # 3 métricas institucionales
GET /api/v1/services             # 6 servicios con acciones
GET /api/v1/cybersecurity        # 5 items seguridad
GET /api/v1/news                 # 5 noticias con relaciones
GET /api/v1/news-featured        # Noticias destacadas
GET /api/v1/bulletin-board       # 6 avisos departamento TI
```

### Componentes Frontend (PRESERVAR)
- **ApiService:** Interfaces TypeScript + métodos HTTP
- **GridComponent:** Compatible con ServiceItem
- **DetailViewComponent:** Reemplaza modal-carousel
- **DashboardComponent:** Chart.js con 4 gráficos

---

## ⚠️ DECISIONES CRÍTICAS Y RESTRICCIONES

### Variables y Nombres (NO CAMBIAR)
- **ApiService interfaces:** ServiceItem, News, BulletinBoardItem, etc.
- **Métodos API:** getServices(), getNews(), getCybersecurity(), etc.
- **Propiedades críticas:** image vs image_url, date vs published_at
- **Rutas:** /dashboard, /services, /ciberseguridad, etc.

### Lógica de Negocio CRÍTICA
- **UUIDs:** Generados en aplicación Laravel (Str::uuid())
- **Relaciones:** Many-to-many news_tags, one-to-many service_actions
- **Scopes:** active(), ordered(), published(), featured()
- **Transformaciones:** Siempre mantener compatibilidad frontend

### Colores Corporativos UBO (INMUTABLES)
- **Primario:** #0d2c5b (azul UBO)
- **Secundario:** #f39c12 (naranja UBO)
- **Backgrounds:** #ffffff, #f8f9fa, #f1f3f4

---

## 🚨 PROBLEMAS CONOCIDOS Y SOLUCIONES

### Problemas de Trackeo (APRENDER DE ESTOS)
1. **Interfaces duplicadas:** Verificar ApiService antes de agregar
2. **Variables SCSS:** Reemplazar con valores directos si hay conflictos
3. **Compatibilidad tipos:** ServiceItem vs CybersecurityItem (solucionado)
4. **Mapeo de propiedades:** image_url ↔ image (crítico mantener)

### Debugging Sistemático
1. **Verificar APIs:** curl http://localhost:8000/api/v1/[endpoint]
2. **Verificar interfaces:** Revisar ApiService.ts
3. **Verificar transformaciones:** Mapeo en controllers
4. **Verificar componentes:** Grid, Card, DetailView compatibilidad

---

## 📋 CHECKLIST PARA MODIFICACIONES

### Antes de Cualquier Cambio
- [ ] Leer proyectos.md para entender estado actual
- [ ] Leer basededatos.md para entender lógica de datos
- [ ] Leer mapa.md para verificar compatibilidad
- [ ] Verificar APIs funcionando: `php artisan serve`
- [ ] Verificar frontend compilando: `npm run build`

### Durante el Desarrollo
- [ ] Mantener interfaces TypeScript existentes
- [ ] Preservar transformaciones de datos críticas
- [ ] No romper APIs existentes
- [ ] Verificar compatibilidad con componentes existentes
- [ ] Usar UUIDs para nuevas entidades

### Después de Cambios
- [ ] Actualizar proyectos.md si hay nuevas funcionalidades
- [ ] Actualizar basededatos.md si hay cambios de esquema
- [ ] Actualizar mapa.md si hay decisiones arquitectónicas
- [ ] Commit con mensaje descriptivo del impacto
- [ ] Verificar que todo compile sin errores

---

## 🎯 OBJETIVOS INMEDIATOS

### Próximos Pasos Prioritarios
1. **Debuggear problemas de carga:** Home y Servicios
2. **Integración tiempo real:** APIs con datos dinámicos
3. **Dashboards adicionales:** Seguridad, Servicios, Financiero
4. **Sistema autenticación:** Laravel Sanctum
5. **CMS básico:** Gestión de contenido

### Métricas de Éxito
- **APIs:** Todas respondiendo correctamente
- **Frontend:** Compilación sin errores críticos
- **Integración:** Datos reales desde PostgreSQL
- **UX:** Loading states y error handling
- **Performance:** Bundle size < 600KB

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación del Proyecto
- **README.md:** Documentación principal y setup
- **DASHBOARD_PROPOSALS.md:** 5 dashboards especializados
- **SISTEMA_IMAGENES_SEGURAS.md:** Fallbacks y branding

### Comandos Críticos
```bash
# Backend
php artisan serve --host=0.0.0.0 --port=8000
php artisan migrate:fresh --seed

# Frontend  
npm start
npm run build

# Testing APIs
curl -s http://localhost:8000/api/debug
curl -s http://localhost:8000/api/v1/services
```

### Estructura de Archivos Crítica
```
/app/Http/Controllers/Api/     # Controllers API
/app/Models/                   # Modelos Eloquent
/database/seeders/             # Datos de prueba
/frontend/src/app/services/    # ApiService
/frontend/src/app/components/  # Componentes Angular
/frontend/src/styles/          # Sistema SCSS
```

---

**RECORDATORIO CRÍTICO:** Este proyecto tiene una arquitectura compleja con muchas interdependencias. SIEMPRE consultar la documentación antes de hacer cambios significativos. La preservación del legacy code y la compatibilidad son PRIORITARIAS sobre nuevas funcionalidades.

**Última actualización:** Enero 2025  
**Rama activa:** mindsurfer  
**Estado:** Integración fullstack completada, dashboard prototipo funcional
