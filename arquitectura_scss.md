# Arquitectura SCSS - UBO Insight MVP

## 🎨 **ESTRUCTURA DE ESTILOS**

### **Convención Adoptada**

```
src/
├─ styles/                 # Globales y compartidos
│   ├─ _tokens.scss        # Design tokens SCSS (variables de diseño)
│   ├─ _mixins.scss        # Mixins utilitarios
│   ├─ _functions.scss     # Funciones SCSS (ej: color, z-index)
│   ├─ _utilities.scss     # Helpers globales (visually-hidden, etc.)
│   ├─ _themes.scss        # Temas (asigna variables CSS a valores)
│   ├─ components/         # Patrones reutilizables (opcional)
│   │   └─ _card.scss
│   ├─ vendors/            # Overrides de librerías si aplican
│   │   └─ _tailwind-overrides.scss
│   └─ index.scss          # Punto de entrada SCSS global
│
└─ styles.scss             # Archivo global real: Tailwind + @use styles/index
```

## 🏗️ **DESCRIPCIÓN DE ARCHIVOS**

### **1. Design Tokens (`_tokens.scss`)**
- **Propósito:** Variables de diseño centralizadas
- **Contenido:** Colores UBO, espaciado, tipografía, breakpoints
- **Uso:** `@use 'styles/tokens' as *;`

### **2. Mixins (`_mixins.scss`)**
- **Propósito:** Funciones reutilizables SCSS
- **Contenido:** Media queries, animaciones, layouts
- **Uso:** `@include media-lg { ... }`

### **3. Funciones (`_functions.scss`)**
- **Propósito:** Funciones SCSS para cálculos
- **Contenido:** Conversiones, z-index, colores
- **Uso:** `z-index: z('modal');`

### **4. Utilidades (`_utilities.scss`)**
- **Propósito:** Clases helper globales
- **Contenido:** `.visually-hidden`, `.sr-only`, `.clearfix`
- **Uso:** Clases CSS directas

### **5. Temas (`_themes.scss`)**
- **Propósito:** Variables CSS para temas
- **Contenido:** `:root { --color-primary: #{$color-primary}; }`
- **Uso:** `color: var(--color-primary);`

### **6. Componentes (`components/`)**
- **Propósito:** Estilos de componentes reutilizables
- **Contenido:** Navbar, Footer, Cards, Buttons
- **Uso:** Automático vía `index.scss`

### **7. Vendors (`vendors/`)**
- **Propósito:** Overrides de librerías externas
- **Contenido:** Tailwind customizations, Angular Material
- **Uso:** Automático vía `index.scss`

### **8. Index (`index.scss`)**
- **Propósito:** Punto de entrada que importa todo
- **Contenido:** `@use` statements organizados
- **Uso:** Importado por `styles.scss`

### **9. Styles Global (`styles.scss`)**
- **Propósito:** Archivo global de Angular
- **Contenido:** Tailwind directives + `@use 'styles/index'`
- **Uso:** Configurado en `angular.json`

## ✅ **VENTAJAS DE ESTA ARQUITECTURA**

### **1. Escalabilidad**
- Fácil agregar nuevos tokens sin afectar componentes
- Componentes modulares e independientes
- Vendors separados para actualizaciones

### **2. Mantenibilidad**
- Variables centralizadas en `_tokens.scss`
- Mixins reutilizables evitan duplicación
- Estructura clara y predecible

### **3. Performance**
- Solo se compila lo que se usa
- Imports organizados evitan conflictos
- Vendors separados para optimización

### **4. Compatibilidad**
- Funciona con Tailwind CSS
- Compatible con Angular 20
- Preparado para temas (claro/oscuro)

## 🎯 **FLUJO DE TRABAJO**

### **Para Agregar Nuevos Estilos:**

1. **Variables de diseño** → `_tokens.scss`
2. **Mixins reutilizables** → `_mixins.scss`
3. **Componentes globales** → `components/_nombre.scss`
4. **Overrides de librerías** → `vendors/_libreria.scss`
5. **Registrar en** → `index.scss`

### **Para Usar en Componentes:**

```scss
// En archivo .component.scss (si necesario)
@use '../../../styles/tokens' as *;
@use '../../../styles/mixins' as *;

.mi-componente {
  color: $color-primary;
  @include media-lg {
    padding: $space-8;
  }
}
```

## 🚨 **REGLAS DE ORO**

### **✅ HACER:**
- Usar variables de `_tokens.scss` para consistencia
- Crear mixins para patrones repetitivos
- Mantener componentes modulares
- Documentar nuevas variables

### **❌ NO HACER:**
- Hardcodear valores (usar tokens)
- Duplicar estilos entre archivos
- Modificar vendors sin documentar
- Crear archivos fuera de la estructura

## 🔧 **CONFIGURACIÓN ACTUAL**

### **Archivos Implementados:**
- ✅ `_tokens.scss` - Colores UBO, espaciado, tipografía
- ✅ `_mixins.scss` - Media queries, layouts
- ✅ `_functions.scss` - Utilidades de cálculo
- ✅ `_utilities.scss` - Clases helper
- ✅ `_themes.scss` - Variables CSS para temas
- ✅ `components/` - Navbar, Footer, Cards, etc.
- ✅ `vendors/` - Tailwind overrides
- ✅ `index.scss` - Punto de entrada organizado

### **Integración Angular:**
```scss
// styles.scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@use 'styles/index';
```

## 📊 **MÉTRICAS DE ÉXITO**

- **Bundle CSS:** ~105kB (optimizado)
- **Compilación:** Sin warnings Sass deprecation
- **Mantenibilidad:** Variables centralizadas
- **Escalabilidad:** Estructura modular preparada

---

**Esta arquitectura SCSS proporciona una base sólida, escalable y mantenible para UBO Insight MVP, respetando las mejores prácticas de desarrollo frontend moderno.**
