# Monitoreo de Estado del Frontend Angular - UBO Insight MVP

## 📋 Resumen Ejecutivo

Se implementó un sistema completo de monitoreo del estado del servidor de desarrollo Angular que detecta automáticamente si el frontend está corriendo, verifica que sea realmente Angular, y actualiza la interfaz en tiempo real.

## 🎯 Funcionalidades Implementadas

### **DETECCIÓN AUTOMÁTICA DEL FRONTEND**

#### **1. Verificación de Puerto**
- **Puerto monitoreado:** 4200 (estándar Angular CLI)
- **Método:** Socket connection + HTTP request
- **Timeout:** 3 segundos para evitar bloqueos

#### **2. Verificación de Angular**
- **Detección inteligente:** Busca `ng-version`, `angular`, `app-root` en el HTML
- **Diferenciación:** Distingue entre Angular y otras aplicaciones en puerto 4200
- **Validación:** Verifica que sea realmente el servidor de desarrollo Angular

#### **3. Estados Posibles**
```php
'healthy'  => Angular corriendo y respondiendo correctamente
'warning'  => Puerto abierto pero problemas de conexión/detección
'error'    => Frontend no está corriendo
'info'     => Estado informativo (fallback)
```

## 🔧 Implementación Técnica

### **BACKEND - StatusController.php**

#### **Método Principal: `checkFrontendStatus()`**
```php
private function checkFrontendStatus()
{
    $frontendUrl = 'http://localhost:4200';
    
    try {
        // 1. HTTP Request con timeout
        $context = stream_context_create([
            'http' => [
                'timeout' => 3,
                'method' => 'GET',
                'header' => [
                    'User-Agent: UBO-Insight-Backend/1.0',
                    'Accept: text/html,application/json'
                ]
            ]
        ]);

        // 2. Obtener respuesta
        $response = @file_get_contents($frontendUrl, false, $context);
        
        // 3. Verificar si es Angular
        $isAngular = strpos($response, 'ng-version') !== false || 
                   strpos($response, 'angular') !== false ||
                   strpos($response, 'app-root') !== false;
        
        // 4. Retornar estado apropiado
        if ($isAngular) {
            return ['status' => 'healthy', ...];
        }
    } catch (\Exception $e) {
        // 5. Fallback: verificar solo el puerto
        $portOpen = $this->isPortOpen('127.0.0.1', 4200);
        // ...
    }
}
```

#### **Método Auxiliar: `isPortOpen()`**
```php
private function isPortOpen($host, $port, $timeout = 3)
{
    try {
        $connection = @fsockopen($host, $port, $errno, $errstr, $timeout);
        if ($connection) {
            fclose($connection);
            return true;
        }
        return false;
    } catch (\Exception $e) {
        return false;
    }
}
```

### **ENDPOINTS API**

#### **1. Status Completo**
- **URL:** `/api/status`
- **Método:** GET
- **Respuesta:** Estado completo del sistema incluyendo frontend

#### **2. Status Solo Frontend**
- **URL:** `/api/frontend-status`
- **Método:** GET
- **Respuesta:** Estado específico del frontend Angular

```json
{
    "success": true,
    "data": {
        "name": "Frontend Angular",
        "status": "healthy",
        "message": "Angular development server is running",
        "details": {
            "url": "http://localhost:4200",
            "port": 4200,
            "detected": "Angular Application",
            "response_size": "1234 bytes",
            "last_check": "2024-01-20T10:30:00Z"
        }
    },
    "timestamp": "2024-01-20T10:30:00Z"
}
```

### **FRONTEND - Vista Status (Blade)**

#### **Interfaz Dinámica**
```html
<div class="border border-gray-200 rounded-lg p-4">
    <div class="flex items-center justify-between mb-2">
        <h4 class="font-semibold text-ubo-primary">Frontend Angular</h4>
        <span class="frontend-status-badge px-2 py-1 rounded-full text-xs font-medium">
            ✅ Healthy
        </span>
    </div>
    
    <p class="frontend-status-message text-sm text-gray-600 mb-3">
        Angular development server is running
    </p>
    
    <div class="space-y-2">
        <a href="http://localhost:4200" target="_blank" 
           class="frontend-action-button bg-green-600 text-white px-4 py-2 rounded-md">
            🌐 Abrir Frontend (Activo)
        </a>
    </div>
</div>
```

#### **JavaScript en Tiempo Real**
```javascript
// Verificar estado cada 10 segundos
async function checkFrontendStatus() {
    try {
        const response = await fetch('/api/frontend-status');
        const data = await response.json();
        
        if (data.success) {
            updateFrontendUI(data.data);
        }
    } catch (error) {
        console.warn('Error checking frontend status:', error);
    }
}

// Actualizar interfaz según estado
function updateFrontendUI(frontendData) {
    const statusBadge = document.querySelector('.frontend-status-badge');
    const statusMessage = document.querySelector('.frontend-status-message');
    const actionButton = document.querySelector('.frontend-action-button');
    
    // Actualizar badge, mensaje y botón según el estado
    // ...
}

// Iniciar monitoreo
checkFrontendStatus();
setInterval(checkFrontendStatus, 10000);
```

## 🎨 Estados Visuales

### **🟢 HEALTHY - Angular Corriendo**
- **Badge:** Verde con ✅
- **Mensaje:** "Angular development server is running"
- **Botón:** Verde "🌐 Abrir Frontend (Activo)"
- **Acción:** Link directo a localhost:4200

### **🟡 WARNING - Puerto Abierto, Problemas**
- **Badge:** Amarillo con ⚠️
- **Mensaje:** "Port 4200 is open but HTTP request failed"
- **Botón:** Amarillo "⚠️ Intentar Abrir Frontend"
- **Acción:** Link con advertencia

### **🔴 ERROR - Frontend No Disponible**
- **Badge:** Rojo con ❌
- **Mensaje:** "Angular development server is not running"
- **Botón:** Gris deshabilitado "❌ Frontend No Disponible"
- **Información:** Comandos para iniciar el servidor

## 📊 Información Detallada

### **Cuando Angular Está Corriendo**
```json
{
    "detected": "Angular Application",
    "port": 4200,
    "response_size": "1234 bytes",
    "last_check": "2024-01-20T10:30:00Z"
}
```

### **Cuando Angular No Está Corriendo**
```json
{
    "expected_url": "http://localhost:4200",
    "expected_port": 4200,
    "status": "offline",
    "command_to_start": "cd frontend && npm start",
    "alternative_command": "cd frontend && ng serve"
}
```

## 🔄 Flujo de Monitoreo

### **PROCESO AUTOMÁTICO**
1. **Cada 10 segundos:** JavaScript hace request a `/api/frontend-status`
2. **Backend verifica:** Puerto 4200 + contenido Angular
3. **Respuesta procesada:** Estado actualizado en tiempo real
4. **UI actualizada:** Badge, mensaje y botón cambian dinámicamente

### **PROCESO MANUAL**
1. **Página carga:** Estado inicial desde PHP
2. **Auto-refresh:** Página completa cada 30 segundos
3. **Verificación inmediata:** Al hacer clic en botones

## 🚀 Comandos de Desarrollo

### **Para Iniciar Angular**
```bash
# Método principal
cd frontend && npm start

# Método alternativo
cd frontend && ng serve

# Con puerto específico
cd frontend && ng serve --port 4200
```

### **Para Verificar Estado**
```bash
# Verificar puerto
netstat -an | grep 4200

# Verificar proceso
ps aux | grep ng

# Test manual
curl http://localhost:4200
```

## 📈 Beneficios Implementados

### **🎯 PARA DESARROLLADORES**
- **Visibilidad inmediata:** Saber si Angular está corriendo sin abrir terminal
- **Diagnóstico rápido:** Identificar problemas de conexión vs problemas de Angular
- **Comandos visibles:** Instrucciones claras para iniciar el servidor

### **🎯 PARA OPERACIONES**
- **Monitoreo automático:** Estado en tiempo real sin intervención manual
- **Detección inteligente:** Diferencia entre puerto ocupado y Angular corriendo
- **Información técnica:** Detalles para debugging y troubleshooting

### **🎯 PARA UX**
- **Botón inteligente:** Habilitado/deshabilitado según disponibilidad
- **Estados visuales claros:** Colores y iconos intuitivos
- **Actualización fluida:** Sin recargas de página completa

## 🔧 Configuración y Personalización

### **Cambiar Puerto de Monitoreo**
```php
// En StatusController.php
$frontendUrl = 'http://localhost:NUEVO_PUERTO';
$this->isPortOpen('127.0.0.1', NUEVO_PUERTO);
```

### **Ajustar Frecuencia de Verificación**
```javascript
// En status/index.blade.php
setInterval(checkFrontendStatus, 15000); // 15 segundos
```

### **Personalizar Detección de Angular**
```php
// Agregar más patrones de detección
$isAngular = strpos($response, 'ng-version') !== false || 
           strpos($response, 'angular') !== false ||
           strpos($response, 'app-root') !== false ||
           strpos($response, 'TU_PATRON_PERSONALIZADO') !== false;
```

## 📍 Acceso al Sistema

### **URLs Disponibles**
- **Status Page:** http://localhost:8000
- **API Status Completo:** http://localhost:8000/api/status
- **API Status Frontend:** http://localhost:8000/api/frontend-status
- **Frontend Angular:** http://localhost:4200 (cuando esté corriendo)

### **Browser Previews**
- **Backend Status:** http://127.0.0.1:38919
- **Frontend Angular:** http://127.0.0.1:XXXX (cuando esté activo)

---

**El sistema de monitoreo del frontend Angular está completamente implementado y funcionando, proporcionando visibilidad en tiempo real del estado del servidor de desarrollo con detección inteligente y actualización automática de la interfaz.** 🎯✨
