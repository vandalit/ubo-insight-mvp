# UBO Insight MVP - Mapa de Implementaciones y Decisiones

## 🗺️ PROPÓSITO DEL DOCUMENTO

Este archivo sirve como **mapa de navegación** para entender:
- **Qué se ha implementado** y en qué orden
- **Decisiones arquitectónicas críticas** y por qué se tomaron
- **Compatibilidades e incompatibilidades** entre funciones
- **Puntos de verificación** para evitar conflictos destructivos

**⚠️ USAR PARA VERIFICAR DISONANCIA COGNITIVA:** Antes de tomar decisiones que puedan generar conflicto entre funciones, consultar este mapa para alinear o la decisión o el mapa.

---

## 📈 CRONOLOGÍA DE IMPLEMENTACIONES

### Fase 1: Fundación (Commits iniciales)
```
790c373 - scss (sistema SCSS base)
2734aeb - componente grid (GridComponent reutilizable)
fbc69cc - ajuste tokens colores (colores corporativos UBO)
f92f084 - vista detalle card (DetailViewComponent)
83e350c - vistas servicios y ciberseguridad (estructura base)
```

**Decisiones Críticas Tomadas:**
- **SCSS organizado:** Sistema de tokens y componentes modulares
- **Componentes reutilizables:** Grid y DetailView como base
- **Colores UBO:** #0d2c5b (primario) y #f39c12 (secundario) INMUTABLES

### Fase 2: Experiencia de Usuario (UX/UI)
```
1018fe0 - skeleton loading (LoadingSkeletonComponent)
9f882ca - noticias article (estructura de artículos)
489a131 - noticias vista (vista completa de noticias)
236e3f1 - fix margenes (ajustes de espaciado)
```

**Decisiones Críticas Tomadas:**
- **Loading states:** Skeleton con animaciones shimmer
- **Layout intercalado:** Noticias con imagen alternada
- **Responsive design:** Mobile-first approach

### Fase 3: Documentación y Arquitectura
```
f450ef4 - feat: Add project documentation and database model
```

**Decisiones Críticas Tomadas:**
- **Documentación como código:** proyectos.md y basededatos.md
- **PostgreSQL → SQL Server:** Estrategia de migración con UUIDs
- **15 tablas:** Esquema completo con relaciones

### Fase 4: Backend e Integración
```
f450ef4 - psql (configuración PostgreSQL)
6cc7f69 - API REST (estructura base APIs)
7c3bb0a - tests laravel (testing framework)
```

**Decisiones Críticas Tomadas:**
- **Laravel 11:** Framework backend con Eloquent ORM
- **UUIDs:** Generados en aplicación para portabilidad
- **API versionada:** /api/v1/* para futuras versiones

### Fase 5: Migración Completa de Datos
```
cf75018 - feat: Migrate home slides and metrics from JSON to PostgreSQL database
7f0e000 - feat: Complete migration of Services and Cybersecurity from JSON to PostgreSQL  
bf3d79d - feat: Complete News, BulletinBoard and Tags system migration + Dashboard proposals
82a5d57 - feat: Complete frontend migration to APIs for News and BulletinBoard
```

**Decisiones Críticas Tomadas:**
- **Migración 100%:** Todos los JSONs → PostgreSQL
- **Transformación de datos:** image_url ↔ image para compatibilidad
- **ApiService:** Interfaces TypeScript para type safety
- **Seeders realistas:** Datos de departamento TI universitario

### Fase 6: Dashboard y Visualización
```
21e6c1e - feat: Implement Chart.js Dashboard prototype with Executive Projects view
```

**Decisiones Críticas Tomadas:**
- **Chart.js 4.0:** Librería de gráficos estándar
- **4 tipos de gráficos:** Doughnut, Line, Bar, Radar
- **KPIs ejecutivos:** Métricas relevantes para jefes TI
- **Navegación dashboard:** Enlace prominente en navbar

---

## 🏗️ ARQUITECTURA DE DECISIONES

### Decisión: UUIDs vs Auto-increment IDs
**Tomada en:** basededatos.md (Fase 3)
**Razón:** Portabilidad PostgreSQL → SQL Server
**Impacto:** Todas las interfaces TypeScript usan `id: string`
**Verificación:** ✅ Implementado en todos los modelos
**Conflictos potenciales:** ⚠️ Nunca usar `id: number` en nuevas interfaces

### Decisión: image_url ↔ image Mapping
**Tomada en:** Migración APIs (Fase 5)
**Razón:** Compatibilidad con componentes existentes
**Impacto:** ApiService transforma datos para mantener frontend
**Verificación:** ✅ GridComponent y CardComponent funcionan
**Conflictos potenciales:** ⚠️ Nuevos componentes deben usar `image` property

### Decisión: DetailView vs Modal-Carousel
**Tomada en:** UX/UI improvements (Fase 2)
**Razón:** Mejor UX basado en referente UBO TiApp
**Impacto:** Reemplazó sistema de modales por vista detalle
**Verificación:** ✅ Servicios y Ciberseguridad usan DetailView
**Conflictos potenciales:** ⚠️ No implementar nuevos modales, usar DetailView

### Decisión: Chart.js vs D3.js
**Tomada en:** Dashboard implementation (Fase 6)
**Razón:** Simplicidad y rapidez de prototipado
**Impacto:** Dashboard ejecutivo funcional con 4 gráficos
**Verificación:** ✅ Bundle size 545KB (excede presupuesto 500KB)
**Conflictos potenciales:** ⚠️ Considerar optimización antes de agregar más gráficos

---

## 🔄 FLUJOS DE DATOS CRÍTICOS

### Flujo: JSON → PostgreSQL → Frontend
```
1. JSON files (legacy) → 2. Seeders (Laravel) → 3. PostgreSQL → 4. API Controllers → 5. ApiService → 6. Components
```

**Puntos críticos:**
- **Seeder transformation:** JSON structure → Database schema
- **API transformation:** Database fields → Frontend interfaces
- **Component compatibility:** Existing components must work with new data

### Flujo: User Interaction → API → Database
```
1. User action → 2. Component event → 3. ApiService call → 4. Laravel Controller → 5. Eloquent Model → 6. PostgreSQL
```

**Puntos críticos:**
- **Type safety:** TypeScript interfaces end-to-end
- **Error handling:** Loading states and error messages
- **Data validation:** Laravel validation rules

---

## ⚠️ INCOMPATIBILIDADES Y CONFLICTOS

### Incompatibilidad: ServiceItem vs CybersecurityItem
**Problema:** Diferentes interfaces para componentes similares
**Solución aplicada:** Transform CybersecurityItem → ServiceItem en ApiService
**Estado:** ✅ Resuelto
**Prevención:** Usar ServiceItem como interfaz estándar para grids

### Incompatibilidad: SCSS Variables vs Direct Values
**Problema:** Variables SCSS no definidas causaban errores de compilación
**Solución aplicada:** Reemplazar variables con valores directos
**Estado:** ✅ Resuelto
**Prevención:** Usar valores directos o verificar que variables estén definidas

### Incompatibilidad: Zone.js vs Zoneless
**Problema:** Angular 20 soporta zoneless pero proyecto usa Zone.js
**Solución aplicada:** Mantener Zone.js por ahora
**Estado:** 🔄 Pendiente migración
**Prevención:** No usar signals hasta migrar completamente

---

## 🎯 PUNTOS DE VERIFICACIÓN OBLIGATORIOS

### Antes de Modificar APIs
- [ ] ✅ Verificar que endpoints existentes siguen funcionando
- [ ] ✅ Mantener transformaciones de datos (image_url ↔ image)
- [ ] ✅ Preservar interfaces TypeScript existentes
- [ ] ✅ Probar con `curl http://localhost:8000/api/v1/[endpoint]`

### Antes de Modificar Componentes
- [ ] ✅ Verificar compatibilidad con ServiceItem interface
- [ ] ✅ Mantener DetailView para navegación
- [ ] ✅ Preservar GridComponent functionality
- [ ] ✅ Probar responsive design

### Antes de Modificar Base de Datos
- [ ] ✅ Verificar que UUIDs se mantienen
- [ ] ✅ Preservar relaciones existentes
- [ ] ✅ Actualizar seeders si es necesario
- [ ] ✅ Probar migraciones en fresh database

---

## 📊 MÉTRICAS DE COMPATIBILIDAD

### APIs Funcionando (CRÍTICO MANTENER)
```bash
✅ GET /api/v1/home/slides          # 3 slides
✅ GET /api/v1/home/metrics         # 3 métricas  
✅ GET /api/v1/services             # 6 servicios
✅ GET /api/v1/cybersecurity        # 5 items
✅ GET /api/v1/news                 # 5 noticias
✅ GET /api/v1/news-featured        # Destacadas
✅ GET /api/v1/bulletin-board       # 6 avisos
```

### Componentes Funcionando (CRÍTICO MANTENER)
```typescript
✅ HomeComponent          # Slides + metrics desde API
✅ ServiciosComponent     # Grid + DetailView
✅ CiberseguridadComponent # Grid + DetailView  
✅ NoticiasComponent      # Articles con hero
✅ DiarioMuralComponent   # Bulletin board items
✅ DashboardComponent     # Chart.js dashboard
```

### Build Status (MONITOREAR)
```bash
✅ Compilation: SUCCESS (545.26 kB bundle)
⚠️ Bundle size: Excede presupuesto 500KB
⚠️ Sass warnings: Deprecation warnings (no críticos)
```

---

## 🚨 ALERTAS DE DISONANCIA COGNITIVA

### Alerta 1: Nuevas Interfaces vs Existentes
**Trigger:** Crear nueva interface para datos similares
**Verificación:** ¿Puede usar ServiceItem existente?
**Acción:** Transformar datos en ApiService si es necesario

### Alerta 2: Nuevos Gráficos vs Bundle Size
**Trigger:** Agregar más librerías de visualización
**Verificación:** Bundle ya excede 500KB
**Acción:** Optimizar existente antes de agregar nuevo

### Alerta 3: Nuevos Modales vs DetailView
**Trigger:** Implementar popup o modal
**Verificación:** DetailView ya maneja navegación
**Acción:** Extender DetailView en lugar de crear modal

### Alerta 4: Cambios de Esquema vs Compatibilidad
**Trigger:** Modificar estructura de base de datos
**Verificación:** ¿Rompe APIs existentes?
**Acción:** Mantener backward compatibility o versionar API

---

## 🎯 ROADMAP DE COMPATIBILIDAD

### Próximas Implementaciones SEGURAS
1. **Dashboard adicionales:** Usar Chart.js existente
2. **Autenticación:** Laravel Sanctum (no afecta APIs públicas)
3. **CMS básico:** Nuevas rutas, no modifica existentes
4. **Optimización bundle:** Lazy loading, tree shaking

### Implementaciones que REQUIEREN VERIFICACIÓN
1. **Migración a Zoneless:** Afecta change detection
2. **SQL Server migration:** Afecta toda la persistencia
3. **API versioning:** Puede romper frontend existente
4. **Component refactoring:** Puede romper DetailView/Grid

### Implementaciones PROHIBIDAS sin Análisis
1. **Cambiar interfaces ServiceItem/News:** Rompe todo el frontend
2. **Eliminar transformaciones de datos:** Rompe compatibilidad
3. **Cambiar colores corporativos:** Rompe branding UBO
4. **Modificar estructura de rutas:** Rompe navegación

---

## 📋 CHECKLIST DE VERIFICACIÓN FINAL

### Pre-commit Verification
- [ ] ✅ APIs responden correctamente
- [ ] ✅ Frontend compila sin errores críticos
- [ ] ✅ Componentes renderizan correctamente
- [ ] ✅ Navegación funciona (home, servicios, etc.)
- [ ] ✅ Dashboard carga gráficos
- [ ] ✅ No hay regresiones en funcionalidad existente

### Post-commit Verification  
- [ ] ✅ Actualizar proyectos.md si hay nuevas funcionalidades
- [ ] ✅ Actualizar basededatos.md si hay cambios de esquema
- [ ] ✅ Actualizar este mapa.md si hay decisiones arquitectónicas
- [ ] ✅ Commit message describe impacto y compatibilidad

---

**RECORDATORIO CRÍTICO:** Este mapa debe consultarse SIEMPRE antes de decisiones que puedan afectar múltiples componentes o romper funcionalidad existente. La preservación de la compatibilidad es PRIORITARIA sobre nuevas funcionalidades.

**Última actualización:** Enero 2025  
**Próxima revisión:** Después de cada implementación mayor  
**Responsable:** Mantener actualizado con cada cambio arquitectónico
