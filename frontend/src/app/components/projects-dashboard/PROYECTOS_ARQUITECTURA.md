# Módulo de Proyectos - UBO Insight MVP
## Integración con Zoho Projects API

## 📋 Resumen Ejecutivo

El módulo de proyectos de UBO Insight MVP se integra con la API de Zoho Projects para proporcionar una vista unificada de la gestión de proyectos del Departamento TI de UBO. Incluye un sistema robusto de permisos y privilegios para diferentes tipos de usuarios (Project Managers, Stakeholders, Desarrolladores).

## 🎯 Objetivos del Módulo

### **PARA PROJECT MANAGERS:**
- Vista completa de todos los proyectos asignados
- Métricas de avance en tiempo real
- Gestión de tareas y asignaciones
- Control de permisos para stakeholders
- Dashboard ejecutivo con KPIs

### **PARA STAKEHOLDERS:**
- Vistas simplificadas y filtradas
- Métricas de alto nivel
- Progreso de proyectos específicos
- Informes ejecutivos
- Acceso controlado por PM

### **PARA DESARROLLADORES:**
- Tareas asignadas personales
- Estado de desarrollo
- Tiempo registrado
- Dependencias de tareas

## 🏗️ Arquitectura de Permisos y Privilegios

### **NIVELES DE ACCESO**

#### **1. SUPER ADMIN (Departamento TI)**
```typescript
permissions: {
  projects: ['view_all', 'create', 'edit', 'delete', 'manage_permissions'],
  tasks: ['view_all', 'create', 'edit', 'delete', 'assign'],
  users: ['view_all', 'manage_permissions'],
  reports: ['view_all', 'export'],
  settings: ['manage_all']
}
```

#### **2. PROJECT MANAGER**
```typescript
permissions: {
  projects: ['view_assigned', 'edit_assigned', 'manage_team'],
  tasks: ['view_project_tasks', 'create', 'edit', 'assign'],
  stakeholders: ['manage_permissions', 'create_views', 'assign_projects'],
  reports: ['view_project_reports', 'export'],
  settings: ['manage_project_settings']
}
```

#### **3. STAKEHOLDER**
```typescript
permissions: {
  projects: ['view_assigned_only'],
  tasks: ['view_summary_only'],
  reports: ['view_assigned_reports'],
  views: ['assigned_by_pm_only'],
  filters: ['pm_defined_only']
}
```

#### **4. DEVELOPER/TEAM MEMBER**
```typescript
permissions: {
  projects: ['view_assigned'],
  tasks: ['view_assigned', 'update_status', 'log_time'],
  reports: ['view_personal'],
  comments: ['add', 'edit_own']
}
```

### **SISTEMA DE TOGGLE PERMISSIONS**

#### **Configuración por Stakeholder:**
```typescript
interface StakeholderPermissions {
  userId: string;
  projectIds: string[];
  enabledViews: {
    overview: boolean;
    timeline: boolean;
    budget: boolean;
    team: boolean;
    milestones: boolean;
    risks: boolean;
  };
  dataAccess: {
    showBudget: boolean;
    showTeamDetails: boolean;
    showTimeTracking: boolean;
    showTaskDetails: boolean;
  };
  filters: {
    allowedStatuses: string[];
    allowedPriorities: string[];
    dateRange: 'current_month' | 'current_quarter' | 'current_year' | 'all';
  };
}
```

## 📊 Estructura de Datos - Zoho Projects API Mock

### **CRITERIO DE ORGANIZACIÓN:**
He decidido crear un directorio `/Zoho_API_mock/` para estructurar los datos de manera modular y escalable:

```
frontend/src/assets/data/Zoho_API_mock/
├── projects.json           # Proyectos principales
├── tasks.json             # Tareas de todos los proyectos
├── users.json             # Usuarios y roles
├── milestones.json        # Hitos y fechas clave
├── time_logs.json         # Registro de tiempo
├── comments.json          # Comentarios y actividad
└── permissions.json       # Configuración de permisos
```

**Justificación del criterio:**
1. **Modularidad:** Cada archivo representa una entidad específica de Zoho
2. **Escalabilidad:** Fácil agregar nuevos tipos de datos
3. **Mantenibilidad:** Cambios aislados por tipo de dato
4. **Performance:** Carga selectiva según necesidades
5. **Realismo:** Simula la estructura real de la API de Zoho

## 🎨 Vistas y Componentes

### **DASHBOARD PRINCIPAL**
- **Resumen ejecutivo:** Proyectos activos, tareas pendientes, progreso general
- **Gráficos de progreso:** Charts.js para visualización
- **Filtros dinámicos:** Por estado, prioridad, fecha, asignado
- **Acciones rápidas:** Crear proyecto, asignar tarea, ver reportes

### **VISTA DE PROYECTO INDIVIDUAL**
- **Header del proyecto:** Nombre, estado, progreso, fechas
- **Navegación secundaria:** Tareas, Equipo, Cronograma, Presupuesto
- **Panel de métricas:** KPIs específicos del proyecto
- **Lista de tareas:** Grid con filtros y ordenamiento

### **VISTA DE TAREAS**
- **Kanban board:** Estados de tareas (To Do, In Progress, Done)
- **Lista detallada:** Tabla con filtros avanzados
- **Vista de calendario:** Cronograma de tareas
- **Asignaciones:** Gestión de responsables

### **BACKOFFICE DE PERMISOS**
- **Gestión de stakeholders:** Lista de usuarios con permisos
- **Configurador de vistas:** Toggle system para habilitar/deshabilitar
- **Asignación de proyectos:** Qué proyectos puede ver cada stakeholder
- **Configuración de filtros:** Restricciones de datos

## 🔧 Integración con Componentes Existentes

### **REUTILIZACIÓN DE COMPONENTES UBO INSIGHT:**

#### **NavbarInsightComponent**
- Navegación entre módulos
- Información de usuario logueado
- Breadcrumbs contextuales

#### **DashboardFooterComponent**
- Enlaces a otros módulos
- Información del sistema
- Soporte técnico

#### **ModuleNavComponent**
```typescript
// Navegación secundaria específica para proyectos
navItems: ModuleNavItem[] = [
  { id: 'overview', label: 'Resumen', route: '/modules/proyectos/overview', icon: '📊' },
  { id: 'projects', label: 'Proyectos', route: '/modules/proyectos/projects', icon: '📁' },
  { id: 'tasks', label: 'Tareas', route: '/modules/proyectos/tasks', icon: '✅' },
  { id: 'team', label: 'Equipo', route: '/modules/proyectos/team', icon: '👥' },
  { id: 'reports', label: 'Reportes', route: '/modules/proyectos/reports', icon: '📈' },
  { id: 'settings', label: 'Configuración', route: '/modules/proyectos/settings', icon: '⚙️' }
];
```

#### **Componentes Reutilizables:**
- **CardComponent:** Para mostrar proyectos y métricas
- **GridComponent:** Para listas de proyectos y tareas
- **Modal-Carousel:** Para detalles de proyectos
- **Loading Skeleton:** Para estados de carga

## 📈 Métricas y KPIs

### **MÉTRICAS PRINCIPALES:**
- **Proyectos Activos:** Número total y porcentaje de progreso
- **Tareas Pendientes:** Por prioridad y fecha de vencimiento
- **Tiempo Registrado:** Horas trabajadas vs. estimadas
- **Hitos Cumplidos:** Porcentaje de cumplimiento de fechas
- **Productividad del Equipo:** Tareas completadas por periodo
- **Presupuesto:** Gastado vs. asignado (si aplicable)

### **DASHBOARDS ESPECÍFICOS:**

#### **Vista Project Manager:**
- Todos los proyectos asignados
- Métricas de equipo completas
- Control de permisos de stakeholders
- Reportes detallados

#### **Vista Stakeholder:**
- Solo proyectos asignados por PM
- Métricas de alto nivel
- Progreso simplificado
- Sin detalles técnicos

#### **Vista Developer:**
- Tareas personales
- Tiempo registrado
- Dependencias de tareas
- Comentarios y actualizaciones

## 🚀 Roadmap de Implementación

### **FASE 1: Estructura Base**
1. Crear componentes principales del módulo
2. Implementar navegación y routing
3. Crear mock data de Zoho Projects
4. Implementar vistas básicas

### **FASE 2: Sistema de Permisos**
1. Implementar lógica de permisos
2. Crear backoffice de configuración
3. Sistema de toggle para stakeholders
4. Filtros dinámicos por rol

### **FASE 3: Visualización de Datos**
1. Integrar Charts.js para métricas
2. Implementar filtros avanzados
3. Crear dashboards específicos por rol
4. Optimizar performance

### **FASE 4: Integración Real**
1. Conectar con API real de Zoho
2. Implementar autenticación OAuth
3. Sincronización de datos
4. Manejo de errores y fallbacks

## 🔗 Endpoints Simulados (Mock)

### **PROYECTOS:**
- `GET /api/v1/zoho/projects` - Lista de proyectos
- `GET /api/v1/zoho/projects/{id}` - Detalles de proyecto
- `GET /api/v1/zoho/projects/{id}/tasks` - Tareas del proyecto
- `GET /api/v1/zoho/projects/{id}/milestones` - Hitos del proyecto

### **TAREAS:**
- `GET /api/v1/zoho/tasks` - Todas las tareas
- `GET /api/v1/zoho/tasks/{id}` - Detalles de tarea
- `GET /api/v1/zoho/tasks/user/{userId}` - Tareas de usuario
- `PUT /api/v1/zoho/tasks/{id}/status` - Actualizar estado

### **USUARIOS:**
- `GET /api/v1/zoho/users` - Lista de usuarios
- `GET /api/v1/zoho/users/{id}/permissions` - Permisos de usuario
- `PUT /api/v1/zoho/users/{id}/permissions` - Actualizar permisos

### **REPORTES:**
- `GET /api/v1/zoho/reports/overview` - Métricas generales
- `GET /api/v1/zoho/reports/project/{id}` - Reporte de proyecto
- `GET /api/v1/zoho/reports/user/{id}` - Reporte de usuario

---

**Esta arquitectura proporciona una base sólida para el módulo de proyectos, con un sistema robusto de permisos, integración con componentes existentes, y preparación para la futura conexión con la API real de Zoho Projects.** 🎯✨
