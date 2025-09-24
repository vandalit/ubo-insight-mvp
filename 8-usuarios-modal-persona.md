# 👥 Los 8 Usuarios Estratégicos del Modal Persona - UBO Insight MVP

## 🎯 **Objetivo del Modal Persona**
Cada usuario representa un **caso de uso específico** y **flujo de prueba diferente** de la aplicación, permitiendo demostrar todas las funcionalidades según roles y permisos reales de la base de datos PostgreSQL.

---

## 📊 **Los 8 Usuarios Demo Estratégicos**

### **1. 📊 María Rodríguez - Jefe de Proyectos TI**
- **Email:** `maria.rodriguez@ubo.cl` | **Password:** `demo123`
- **Rol:** `project_manager` | **Security Clearance:** Level 3
- **Departamento:** Tecnologías de la Información

**🎯 Representa:** Gestión de proyectos institucionales y equipos de trabajo
**🔧 Flujo de Prueba:**
- ✅ **Crear y gestionar proyectos** (CRUD completo)
- ✅ **Asignar usuarios a proyectos** con permisos específicos
- ✅ **Dashboard de proyectos** con métricas y progreso
- ✅ **Acceso a CMS** para contenido de proyectos
- ✅ **Gestión de equipos** y asignación de roles

**📋 Permisos:** `['proyectos', 'cms', 'datos', 'team_management', 'project_creation']`
**📁 Proyectos:** UBO Insight MVP, Sistema de Ciberseguridad, Portal Institucional

---

### **2. 🎓 Carlos Méndez - Stakeholder Académico**
- **Email:** `carlos.mendez@ubo.cl` | **Password:** `demo123`
- **Rol:** `stakeholder` | **Security Clearance:** Level 1
- **Departamento:** Dirección Académica

**🎯 Representa:** Director académico que necesita métricas y seguimiento de proyectos
**🔧 Flujo de Prueba:**
- ✅ **Ver proyectos asignados** (solo lectura)
- ✅ **Métricas básicas de compliance** y riesgo académico
- ✅ **Reportes específicos** de su área
- ❌ **NO puede editar** ni crear contenido
- ❌ **Acceso limitado** solo a datos relevantes

**📋 Permisos:** `['proyectos_readonly', 'compliance_access', 'basic_metrics']`
**📁 Proyectos:** Sistema de Gestión Académica, Portal Estudiantes

---

### **3. 💻 Juan Silva - Desarrollador Full-Stack**
- **Email:** `juan.silva@ubo.cl` | **Password:** `demo123`
- **Rol:** `developer` | **Security Clearance:** Level 2
- **Departamento:** Desarrollo de Software

**🎯 Representa:** Desarrollador enfocado en CMS y vulnerabilidades técnicas
**🔧 Flujo de Prueba:**
- ✅ **Gestión completa de CMS** y contenido web
- ✅ **Administración de contenido** dinámico
- ✅ **Acceso a vulnerabilidades técnicas** y herramientas
- ❌ **NO acceso a gestión de proyectos**
- ❌ **NO acceso a ciberseguridad estratégica**

**📋 Permisos:** `['cms', 'datos', 'vuln_access', 'technical_tools']`
**📁 Proyectos:** UBO Insight MVP

---

### **4. 🛡️ Ana Torres - Analista de Ciberseguridad**
- **Email:** `ana.torres@ubo.cl` | **Password:** `demo123`
- **Rol:** `security_analyst` | **Security Clearance:** Level 3
- **Departamento:** Ciberseguridad

**🎯 Representa:** Especialista en monitoreo de amenazas y operaciones SOC
**🔧 Flujo de Prueba:**
- ✅ **Dashboard completo de ciberseguridad** con métricas en tiempo real
- ✅ **Monitoreo SOC** y gestión de vulnerabilidades
- ✅ **Gestión de incidentes** de seguridad
- ✅ **Análisis de amenazas** y respuesta
- ❌ **NO acceso a gestión de proyectos**

**📋 Permisos:** `['ciberseguridad', 'datos', 'soc_access', 'vuln_access', 'incident_access']`
**📁 Proyectos:** Sistema de Monitoreo de Seguridad, Auditorías de Seguridad

---

### **5. 👨‍💼 Ricardo Soto - CISO (Chief Information Security Officer)**
- **Email:** `ricardo.soto@ubo.cl` | **Password:** `demo123`
- **Rol:** `ciso` | **Security Clearance:** Level 5
- **Departamento:** Ciberseguridad

**🎯 Representa:** Responsable estratégico de ciberseguridad institucional
**🔧 Flujo de Prueba:**
- ✅ **Vista ejecutiva de ciberseguridad** con KPIs estratégicos
- ✅ **Estrategia y compliance** de seguridad institucional
- ✅ **Reportes ejecutivos** de riesgo y cumplimiento
- ✅ **Supervisión de proyectos** de seguridad
- ✅ **Acceso completo** a datos de ciberseguridad

**📋 Permisos:** `['ciberseguridad', 'proyectos', 'datos', 'compliance_access', 'risk_access', 'soc_access', 'executive_reports']`
**📁 Proyectos:** Estrategia de Ciberseguridad 2024, Compliance ISO 27001, Plan de Continuidad de Negocio

---

### **6. 📋 Patricia Vega - Oficial de Cumplimiento**
- **Email:** `patricia.vega@ubo.cl` | **Password:** `demo123`
- **Rol:** `compliance_officer` | **Security Clearance:** Level 2
- **Departamento:** Auditoría y Cumplimiento

**🎯 Representa:** Especialista en marcos normativos y auditorías de seguridad
**🔧 Flujo de Prueba:**
- ✅ **Dashboards de compliance** (ISO 27001, GDPR, SOX)
- ✅ **Reportes de auditoría** y cumplimiento normativo
- ✅ **Métricas de cumplimiento** y certificaciones
- ✅ **Gestión de marcos normativos** institucionales
- ❌ **Acceso limitado** solo a compliance y auditoría

**📋 Permisos:** `['compliance_access', 'datos', 'audit_reports']`
**📁 Proyectos:** Auditoría ISO 27001, Cumplimiento GDPR, Certificación SOX

---

### **7. 🚨 Diego Morales - Especialista en Respuesta a Incidentes**
- **Email:** `diego.morales@ubo.cl` | **Password:** `demo123`
- **Rol:** `incident_responder` | **Security Clearance:** Level 4
- **Departamento:** Centro de Respuesta a Incidentes

**🎯 Representa:** Respuesta inmediata a incidentes de seguridad y análisis forense
**🔧 Flujo de Prueba:**
- ✅ **Centro de respuesta a incidentes** con alertas en tiempo real
- ✅ **Análisis forense digital** y herramientas especializadas
- ✅ **Gestión de crisis** de seguridad
- ✅ **Threat hunting** y análisis de malware
- ❌ **Acceso especializado** solo en incidentes y forensia

**📋 Permisos:** `['ciberseguridad', 'incident_access', 'forensic_tools', 'emergency_response']`
**📁 Proyectos:** CERT-UBO, Plan de Respuesta a Incidentes, Forensia Digital

---

### **8. 👑 Administrador UBO Insight** (Default - No aparece en modal)
- **Email:** `admin@ubo.cl` | **Password:** `admin123`
- **Rol:** `admin` | **Security Clearance:** Level 5
- **Departamento:** Administración del Sistema

**🎯 Representa:** Control total del sistema y gestión de usuarios
**🔧 Flujo de Prueba:**
- ✅ **Acceso completo** a todos los módulos
- ✅ **Gestión de usuarios** y asignación de roles
- ✅ **Configuración del sistema** y parámetros globales
- ✅ **Supervisión general** de todas las actividades
- ✅ **Demostración completa** de funcionalidades

**📋 Permisos:** `['ciberseguridad', 'proyectos', 'cms', 'datos', 'admin_access', 'user_management']`
**📁 Proyectos:** Todos los proyectos

---

## 🎨 **Identificación Visual por Roles**

| Rol | Color | Icono | Clearance |
|-----|-------|-------|-----------|
| **Project Manager** | 🔵 Azul | 📊 | Level 3 |
| **Stakeholder** | 🟠 Naranja | 🎓 | Level 1 |
| **Developer** | 🟢 Verde | 💻 | Level 2 |
| **Security Analyst** | 🔴 Rojo | 🛡️ | Level 3 |
| **CISO** | 🟣 Púrpura | 👨‍💼 | Level 5 |
| **Compliance Officer** | 🟢 Esmeralda | 📋 | Level 2 |
| **Incident Responder** | 🟡 Amarillo | 🚨 | Level 4 |
| **Admin** | 🔵 Azul Oscuro | 👑 | Level 5 |

---

## 🔄 **Flujos de Prueba por Módulo**

### **📊 Módulo Proyectos**
- **Admin + Project Manager:** CRUD completo, asignación de equipos
- **Stakeholder:** Solo lectura de proyectos asignados
- **Otros roles:** Sin acceso directo

### **🛡️ Módulo Ciberseguridad**
- **Admin + CISO:** Vista ejecutiva completa
- **Security Analyst + Incident Responder:** Operaciones y análisis
- **Otros roles:** Sin acceso o muy limitado

### **⚙️ Módulo CMS**
- **Admin + Project Manager + Developer:** Gestión completa
- **Otros roles:** Sin acceso

### **📋 Módulo Compliance**
- **Admin + CISO + Compliance Officer:** Acceso completo
- **Project Manager + Stakeholder:** Métricas básicas
- **Otros roles:** Sin acceso

---

## 🗄️ **Sincronización Base de Datos**

### **Estado Actual:**
- ✅ **UsersSeeder actualizado** con los 8 usuarios
- ✅ **UserController mejorado** con soporte para todos los roles
- ✅ **PersonaModal sincronizado** con colores y descripciones
- ✅ **Permisos granulares** definidos por rol
- ✅ **Fallbacks robustos** implementados

### **Comandos para Aplicar:**
```bash
# Migrar y poblar base de datos
php artisan migrate:fresh --seed

# Verificar usuarios creados
php artisan tinker
>>> User::all()->pluck('name', 'email')
```

---

## 🎯 **Casos de Uso de Demostración**

### **Demo Completa (Admin):**
- Mostrar todas las funcionalidades del sistema
- Gestión de usuarios y asignación de roles
- Vista general de todos los módulos

### **Demo Gestión de Proyectos (Project Manager):**
- Crear proyecto nuevo
- Asignar usuarios con diferentes permisos
- Seguimiento de progreso y métricas

### **Demo Ciberseguridad (Security Analyst):**
- Monitoreo de amenazas en tiempo real
- Gestión de vulnerabilidades
- Respuesta a incidentes

### **Demo Ejecutiva (CISO):**
- KPIs estratégicos de seguridad
- Reportes de compliance
- Vista de riesgo institucional

### **Demo Compliance (Compliance Officer):**
- Auditorías y certificaciones
- Marcos normativos
- Reportes de cumplimiento

### **Demo Stakeholder (Stakeholder):**
- Vista limitada de proyectos asignados
- Métricas académicas básicas
- Reportes de solo lectura

---

**✅ Los 8 usuarios están completamente implementados y sincronizados entre la base de datos PostgreSQL, las APIs de Laravel y el frontend de Angular, proporcionando una experiencia de demostración completa y realista del sistema UBO Insight MVP.**
