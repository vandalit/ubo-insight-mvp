<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UBO Insight MVP - System Status</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'ubo-primary': '#0d2c5b',
                        'ubo-secondary': '#f39c12'
                    }
                }
            }
        }
    </script>
    <style>
        .status-healthy { @apply bg-green-100 text-green-800 border-green-200; }
        .status-warning { @apply bg-yellow-100 text-yellow-800 border-yellow-200; }
        .status-error { @apply bg-red-100 text-red-800 border-red-200; }
        .status-info { @apply bg-blue-100 text-blue-800 border-blue-200; }
        
        .pulse-dot {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-8 fade-in">
            <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 bg-ubo-primary rounded-full flex items-center justify-center mr-4">
                    <span class="text-white font-bold text-xl">UBO</span>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-ubo-primary">UBO Insight MVP</h1>
                    <p class="text-gray-600">Sistema de Gestión Integral Universitario</p>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span class="text-gray-500">Versión:</span>
                        <span class="font-semibold ml-2">{{ $status['system']['version'] }}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Entorno:</span>
                        <span class="font-semibold ml-2 capitalize">{{ $status['system']['environment'] }}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Debug:</span>
                        <span class="font-semibold ml-2">{{ $status['system']['debug'] ? 'Activo' : 'Inactivo' }}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Actualizado:</span>
                        <span class="font-semibold ml-2">{{ \Carbon\Carbon::parse($status['system']['timestamp'])->format('H:i:s') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            @foreach($status['checks'] as $key => $check)
                <div class="bg-white rounded-lg shadow-md p-6 fade-in" style="animation-delay: {{ $loop->index * 0.1 }}s">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">{{ $check['name'] }}</h3>
                        <div class="flex items-center">
                            @if($check['status'] === 'healthy')
                                <div class="w-3 h-3 bg-green-500 rounded-full pulse-dot"></div>
                                <span class="ml-2 text-sm font-medium text-green-600">Saludable</span>
                            @elseif($check['status'] === 'warning')
                                <div class="w-3 h-3 bg-yellow-500 rounded-full pulse-dot"></div>
                                <span class="ml-2 text-sm font-medium text-yellow-600">Advertencia</span>
                            @elseif($check['status'] === 'error')
                                <div class="w-3 h-3 bg-red-500 rounded-full pulse-dot"></div>
                                <span class="ml-2 text-sm font-medium text-red-600">Error</span>
                            @else
                                <div class="w-3 h-3 bg-blue-500 rounded-full pulse-dot"></div>
                                <span class="ml-2 text-sm font-medium text-blue-600">Info</span>
                            @endif
                        </div>
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-4">{{ $check['message'] }}</p>
                    
                    @if(isset($check['details']))
                        <div class="bg-gray-50 rounded-md p-3">
                            <h4 class="text-xs font-semibold text-gray-700 mb-2">DETALLES:</h4>
                            @if(is_array($check['details']))
                                @foreach($check['details'] as $detailKey => $detailValue)
                                    @if(is_array($detailValue))
                                        <div class="mb-2">
                                            <span class="text-xs text-gray-500">{{ $detailKey }}:</span>
                                            @foreach($detailValue as $subKey => $subValue)
                                                <div class="ml-4 text-xs">
                                                    <span class="text-gray-500">{{ $subKey }}:</span>
                                                    <span class="font-mono">{{ $subValue }}</span>
                                                </div>
                                            @endforeach
                                        </div>
                                    @else
                                        <div class="text-xs mb-1">
                                            <span class="text-gray-500">{{ $detailKey }}:</span>
                                            <span class="font-mono ml-2">{{ $detailValue }}</span>
                                        </div>
                                    @endif
                                @endforeach
                            @endif
                        </div>
                    @endif
                    
                    @if(isset($check['error']))
                        <div class="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                            <h4 class="text-xs font-semibold text-red-700 mb-1">ERROR:</h4>
                            <p class="text-xs text-red-600 font-mono">{{ $check['error'] }}</p>
                        </div>
                    @endif
                </div>
            @endforeach
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8 fade-in" style="animation-delay: 0.5s">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">🚀 Acciones Rápidas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-ubo-primary">{{ $status['checks']['frontend']['name'] ?? 'Frontend Angular' }}</h4>
                        @php
                            $frontendStatus = $status['checks']['frontend']['status'] ?? 'unknown';
                            $statusColors = [
                                'healthy' => 'bg-green-100 text-green-800',
                                'warning' => 'bg-yellow-100 text-yellow-800', 
                                'error' => 'bg-red-100 text-red-800',
                                'info' => 'bg-blue-100 text-blue-800'
                            ];
                            $statusIcons = [
                                'healthy' => '✅',
                                'warning' => '⚠️',
                                'error' => '❌',
                                'info' => 'ℹ️'
                            ];
                        @endphp
                        <span class="px-2 py-1 rounded-full text-xs font-medium frontend-status-badge {{ $statusColors[$frontendStatus] ?? 'bg-gray-100 text-gray-800' }}">
                            {{ $statusIcons[$frontendStatus] ?? '❓' }} {{ ucfirst($frontendStatus) }}
                        </span>
                    </div>
                    
                    <p class="text-sm text-gray-600 mb-3 frontend-status-message">{{ $status['checks']['frontend']['message'] ?? 'Estado del servidor de desarrollo' }}</p>
                    
                    <div class="space-y-2">
                        @if($frontendStatus === 'healthy')
                            <a href="http://localhost:4200" target="_blank" 
                               class="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors frontend-action-button">
                                🌐 Abrir Frontend (Activo)
                            </a>
                        @elseif($frontendStatus === 'warning')
                            <a href="http://localhost:4200" target="_blank" 
                               class="inline-block bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700 transition-colors frontend-action-button">
                                ⚠️ Intentar Abrir Frontend
                            </a>
                        @else
                            <button disabled 
                                    class="inline-block bg-gray-400 text-white px-4 py-2 rounded-md text-sm cursor-not-allowed frontend-action-button">
                                ❌ Frontend No Disponible
                            </button>
                        @endif
                        
                        @if(isset($status['checks']['frontend']['details']))
                            <div class="text-xs text-gray-500 space-y-1">
                                @if(isset($status['checks']['frontend']['details']['detected']))
                                    <div><strong>Detectado:</strong> {{ $status['checks']['frontend']['details']['detected'] }}</div>
                                @endif
                                @if(isset($status['checks']['frontend']['details']['port']))
                                    <div><strong>Puerto:</strong> {{ $status['checks']['frontend']['details']['port'] }}</div>
                                @endif
                                @if(isset($status['checks']['frontend']['details']['response_size']))
                                    <div><strong>Tamaño respuesta:</strong> {{ $status['checks']['frontend']['details']['response_size'] }}</div>
                                @endif
                                @if($frontendStatus === 'error')
                                    <div class="mt-2 p-2 bg-gray-50 rounded">
                                        <strong>Para iniciar:</strong><br>
                                        <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ $status['checks']['frontend']['details']['command_to_start'] ?? 'cd frontend && npm start' }}</code>
                                    </div>
                                @endif
                            </div>
                        @endif
                    </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4">
                    <h4 class="font-semibold text-ubo-primary mb-2">APIs Backend</h4>
                    <p class="text-sm text-gray-600 mb-3">Endpoints de la aplicación</p>
                    <div class="space-y-2">
                        <a href="/api/v1/home/slides" target="_blank" 
                           class="inline-block bg-ubo-secondary text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition-colors">
                            🔗 Test APIs
                        </a>
                        <div class="text-xs text-gray-500">
                            <code class="bg-gray-100 px-2 py-1 rounded">php artisan serve</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Documentation Links -->
        <div class="bg-white rounded-lg shadow-md p-6 fade-in" style="animation-delay: 0.6s">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">📚 Documentación del Proyecto</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="/docs/warnings" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 class="font-semibold text-red-600 mb-1">⚠️ WARNINGS.md</h4>
                    <p class="text-xs text-gray-600">Sistema de detección de conflictos</p>
                </a>
                <a href="/docs/context" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 class="font-semibold text-blue-600 mb-1">🤖 CONTEXT.md</h4>
                    <p class="text-xs text-gray-600">Contexto para desarrollo futuro</p>
                </a>
                <a href="/docs/mapa" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 class="font-semibold text-green-600 mb-1">🗺️ MAPA.md</h4>
                    <p class="text-xs text-gray-600">Roadmap y decisiones</p>
                </a>
                <a href="/docs/database" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 class="font-semibold text-purple-600 mb-1">🗄️ BASEDEDATOS.md</h4>
                    <p class="text-xs text-gray-600">Modelo y lógica de BD</p>
                </a>
            </div>
        </div>

        <!-- New Interactive Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Sitemap Section -->
            <div class="bg-white rounded-lg shadow-md p-6 fade-in" style="animation-delay: 0.7s">
                <div class="flex items-center justify-between mb-4 cursor-pointer" onclick="toggleAccordion('sitemap')">
                    <h3 class="text-lg font-semibold text-gray-800">🗺️ Sitemap Backend</h3>
                    <svg id="sitemap-icon" class="w-5 h-5 transition-transform duration-200 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                
                <div id="sitemap-content" class="hidden">
                    <p class="text-sm text-gray-600 mb-4">Estructura y navegación del sitio web</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <a href="/sitemap.xml" target="_blank" class="inline-flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                            📄 Ver XML
                        </a>
                        <button onclick="loadSitemapAscii()" class="inline-flex items-center px-3 py-2 text-sm bg-ubo-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
                            📋 Ver ASCII
                        </button>
                    </div>
                    <div id="sitemap-ascii" class="hidden">
                        <div class="bg-gray-50 rounded-md p-4 border">
                            <h4 class="text-xs font-semibold text-gray-700 mb-2">ESTRUCTURA ASCII:</h4>
                            <pre class="text-xs text-gray-800 overflow-x-auto"><code id="sitemap-ascii-content">Cargando...</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Database Section -->
            <div class="bg-white rounded-lg shadow-md p-6 fade-in" style="animation-delay: 0.8s">
                <div class="flex items-center justify-between mb-4 cursor-pointer" onclick="toggleAccordion('database')">
                    <h3 class="text-lg font-semibold text-gray-800">🗄️ Base de Datos</h3>
                    <svg id="database-icon" class="w-5 h-5 transition-transform duration-200 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                
                <div id="database-content" class="hidden">
                    <p class="text-sm text-gray-600 mb-4">Estructura y modelo de la base de datos</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <button onclick="loadDatabaseAscii()" class="inline-flex items-center px-3 py-2 text-sm bg-ubo-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
                            📋 Ver ASCII
                        </button>
                        <a href="/database/visual" target="_blank" class="inline-flex items-center px-3 py-2 text-sm bg-ubo-secondary text-white rounded-md hover:bg-opacity-90 transition-colors">
                            🎨 Vista Visual Bento
                        </a>
                        <button onclick="loadDatabaseSchema()" class="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            📊 Schema JSON
                        </button>
                    </div>
                    <div id="database-ascii" class="hidden mb-4">
                        <div class="bg-gray-50 rounded-md p-4 border">
                            <h4 class="text-xs font-semibold text-gray-700 mb-2">ESTRUCTURA ASCII:</h4>
                            <pre class="text-xs text-gray-800 overflow-x-auto"><code id="database-ascii-content">Cargando...</code></pre>
                        </div>
                    </div>
                    <div id="database-schema" class="hidden">
                        <div class="bg-gray-50 rounded-md p-4 border max-h-64 overflow-y-auto">
                            <h4 class="text-xs font-semibold text-gray-700 mb-2">SCHEMA JSON:</h4>
                            <pre class="text-xs text-gray-800"><code id="database-schema-content">Cargando...</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Frontend Sitemap Section -->
            <div class="bg-white rounded-lg shadow-md p-6 fade-in" style="animation-delay: 0.9s">
                <div class="flex items-center justify-between mb-4 cursor-pointer" onclick="toggleAccordion('frontend')">
                    <h3 class="text-lg font-semibold text-gray-800">🎯 Sitemap Frontend</h3>
                    <svg id="frontend-icon" class="w-5 h-5 transition-transform duration-200 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                
                <div id="frontend-content" class="hidden">
                    <p class="text-sm text-gray-600 mb-4">Flujo de navegación y experiencia de usuario</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <button onclick="loadFrontendFlow()" class="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            🎯 Ver Flujo UX
                        </button>
                        <button onclick="loadFrontendRoutes()" class="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            🛣️ Ver Rutas
                        </button>
                    </div>
                    <div id="frontend-flow" class="hidden mb-4">
                        <div class="bg-gray-50 rounded-md p-4 border">
                            <h4 class="text-xs font-semibold text-gray-700 mb-2">FLUJO DE NAVEGACIÓN UX:</h4>
                            <div class="text-xs text-gray-800 overflow-x-auto"><div id="frontend-flow-content">Cargando...</div></div>
                        </div>
                    </div>
                    <div id="frontend-routes" class="hidden">
                        <div class="bg-gray-50 rounded-md p-4 border max-h-64 overflow-y-auto">
                            <h4 class="text-xs font-semibold text-gray-700 mb-2">RUTAS ANGULAR:</h4>
                            <pre class="text-xs text-gray-800"><code id="frontend-routes-content">Cargando...</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-gray-500 text-sm fade-in" style="animation-delay: 0.7s">
            <p>Universidad Bernardo O'Higgins - Departamento de Tecnologías de la Información</p>
            <p class="mt-1">Actualizado automáticamente cada 30 segundos</p>
        </div>
    </div>

    <script>
        // Accordion functionality
        function toggleAccordion(section) {
            const content = document.getElementById(section + '-content');
            const icon = document.getElementById(section + '-icon');
            
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        }

        // Load sitemap ASCII
        async function loadSitemapAscii() {
            const container = document.getElementById('sitemap-ascii');
            const content = document.getElementById('sitemap-ascii-content');
            
            try {
                container.classList.remove('hidden');
                content.textContent = 'Cargando...';
                
                const response = await fetch('/sitemap/ascii');
                const text = await response.text();
                content.textContent = text;
            } catch (error) {
                content.textContent = 'Error cargando sitemap: ' + error.message;
            }
        }

        // Load database ASCII
        async function loadDatabaseAscii() {
            const container = document.getElementById('database-ascii');
            const content = document.getElementById('database-ascii-content');
            
            try {
                container.classList.remove('hidden');
                content.textContent = 'Cargando...';
                
                const response = await fetch('/database/ascii');
                const text = await response.text();
                content.textContent = text;
            } catch (error) {
                content.textContent = 'Error cargando database ASCII: ' + error.message;
            }
        }

        // Load database schema JSON
        async function loadDatabaseSchema() {
            const container = document.getElementById('database-schema');
            const content = document.getElementById('database-schema-content');
            
            try {
                container.classList.remove('hidden');
                content.textContent = 'Cargando...';
                
                const response = await fetch('/database/schema');
                const json = await response.json();
                content.textContent = JSON.stringify(json, null, 2);
            } catch (error) {
                content.textContent = 'Error cargando schema: ' + error.message;
            }
        }

        // Load frontend flow diagram
        async function loadFrontendFlow() {
            const container = document.getElementById('frontend-flow');
            const content = document.getElementById('frontend-flow-content');
            
            try {
                container.classList.remove('hidden');
                content.innerHTML = 'Cargando...';
                
                const flowDiagram = `
<div class="frontend-flow-diagram">
    <div class="flow-section">
        <h5 class="font-bold text-blue-600 mb-2">🏠 SITIO PÚBLICO</h5>
        <div class="flow-path">
            <span class="flow-node">Home</span> →
            <span class="flow-node">Servicios</span> →
            <span class="flow-node">Ciberseguridad</span> →
            <span class="flow-node">Noticias</span> →
            <span class="flow-node">Diario Mural</span>
        </div>
    </div>
    
    <div class="flow-section mt-4">
        <h5 class="font-bold text-green-600 mb-2">🔐 AUTENTICACIÓN</h5>
        <div class="flow-path">
            <span class="flow-node">Login</span> →
            <span class="flow-node">Persona Modal</span> →
            <span class="flow-node">Dashboard</span>
        </div>
    </div>
    
    <div class="flow-section mt-4">
        <h5 class="font-bold text-purple-600 mb-2">📊 MÓDULOS DASHBOARD</h5>
        <div class="flow-grid">
            <div class="flow-module">
                <strong>Ciberseguridad</strong><br>
                <small>Políticas, CERT-UBO, Auditorías</small>
            </div>
            <div class="flow-module">
                <strong>Proyectos</strong><br>
                <small>Overview, Tasks, Team, Reports</small>
            </div>
            <div class="flow-module">
                <strong>CMS</strong><br>
                <small>Home, Services, News, Diario</small>
            </div>
        </div>
    </div>
    
    <div class="flow-section mt-4">
        <h5 class="font-bold text-orange-600 mb-2">⚙️ FLUJO DE NAVEGACIÓN</h5>
        <div class="flow-path">
            <span class="flow-step">1. Usuario visita sitio público</span><br>
            <span class="flow-step">2. Explora servicios y contenido</span><br>
            <span class="flow-step">3. Hace login para acceder a dashboard</span><br>
            <span class="flow-step">4. Selecciona persona/rol en modal</span><br>
            <span class="flow-step">5. Accede a módulos según permisos</span><br>
            <span class="flow-step">6. Gestiona contenido via CMS</span>
        </div>
    </div>
</div>

<style>
.frontend-flow-diagram { font-size: 11px; }
.flow-section { padding: 8px; border-left: 3px solid #e5e7eb; margin-left: 8px; }
.flow-path { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.flow-node { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-weight: 500; }
.flow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
.flow-module { background: #f9fafb; padding: 6px; border-radius: 4px; border: 1px solid #e5e7eb; }
.flow-step { background: #fef3c7; padding: 2px 6px; border-radius: 4px; margin: 2px 0; display: inline-block; }
</style>`;
                
                content.innerHTML = flowDiagram;
            } catch (error) {
                content.innerHTML = 'Error cargando flujo: ' + error.message;
            }
        }

        // Load frontend routes
        async function loadFrontendRoutes() {
            const container = document.getElementById('frontend-routes');
            const content = document.getElementById('frontend-routes-content');
            
            try {
                container.classList.remove('hidden');
                content.textContent = 'Cargando...';
                
                const routes = `// RUTAS PÚBLICAS
{ path: '', redirectTo: '/home', pathMatch: 'full' }
{ path: 'home', component: HomeComponent }
{ path: 'servicios', component: ServiciosComponent }
{ path: 'ciberseguridad', component: CiberseguridadComponent }
{ path: 'noticias', component: NoticiasComponent }
{ path: 'diario-mural', component: DiarioMuralComponent }

// AUTENTICACIÓN
{ path: 'login', component: LoginComponent }

// DASHBOARD PRINCIPAL
{ path: 'dashboard', component: DashboardComponent }

// MÓDULOS ESPECIALIZADOS
{ path: 'modules/ciberseguridad', component: CybersecurityDashboardComponent }
{ path: 'modules/proyectos', component: ProjectsDashboardComponent }
{ path: 'modules/proyectos/overview', component: ProjectsDashboardComponent }
{ path: 'modules/proyectos/projects', component: ProjectsDashboardComponent }
{ path: 'modules/proyectos/tasks', component: ProjectsDashboardComponent }
{ path: 'modules/proyectos/team', component: ProjectsDashboardComponent }
{ path: 'modules/proyectos/reports', component: ProjectsDashboardComponent }
{ path: 'modules/proyectos/settings', component: ProjectsDashboardComponent }

// CMS PRINCIPAL
{ path: 'modules/cms', component: CMSDashboardComponent }

// CMS SUB-RUTAS
{ path: 'modules/cms/home', component: HomeContentComponent }
{ path: 'modules/cms/services', component: ServicesContentComponent }
{ path: 'modules/cms/news', component: NewsContentComponent }
{ path: 'modules/cms/diario-mural', component: DiarioMuralContentComponent }

// FALLBACK
{ path: '**', redirectTo: '/home' }

TOTAL: 22 rutas configuradas
COMPONENTES: 15 componentes principales
MÓDULOS: 3 módulos especializados (Ciberseguridad, Proyectos, CMS)`;
                
                content.textContent = routes;
            } catch (error) {
                content.textContent = 'Error cargando rutas: ' + error.message;
            }
        }

        // Auto-refresh every 30 seconds
        setTimeout(() => {
            location.reload();
        }, 30000);
        
        // Check frontend status every 10 seconds
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
        
        function updateFrontendUI(frontendData) {
            const statusBadge = document.querySelector('.frontend-status-badge');
            const statusMessage = document.querySelector('.frontend-status-message');
            const actionButton = document.querySelector('.frontend-action-button');
            
            if (!statusBadge || !statusMessage || !actionButton) return;
            
            const status = frontendData.status;
            const statusColors = {
                'healthy': 'bg-green-100 text-green-800',
                'warning': 'bg-yellow-100 text-yellow-800',
                'error': 'bg-red-100 text-red-800',
                'info': 'bg-blue-100 text-blue-800'
            };
            
            const statusIcons = {
                'healthy': '✅',
                'warning': '⚠️',
                'error': '❌',
                'info': 'ℹ️'
            };
            
            // Update badge
            statusBadge.className = `px-2 py-1 rounded-full text-xs font-medium frontend-status-badge ${statusColors[status] || 'bg-gray-100 text-gray-800'}`;
            statusBadge.textContent = `${statusIcons[status] || '❓'} ${status.charAt(0).toUpperCase() + status.slice(1)}`;
            
            // Update message
            statusMessage.textContent = frontendData.message || 'Estado del servidor de desarrollo';
            
            // Update button
            if (status === 'healthy') {
                actionButton.className = 'inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors frontend-action-button';
                actionButton.textContent = '🌐 Abrir Frontend (Activo)';
                actionButton.disabled = false;
                actionButton.href = 'http://localhost:4200';
            } else if (status === 'warning') {
                actionButton.className = 'inline-block bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700 transition-colors frontend-action-button';
                actionButton.textContent = '⚠️ Intentar Abrir Frontend';
                actionButton.disabled = false;
                actionButton.href = 'http://localhost:4200';
            } else {
                actionButton.className = 'inline-block bg-gray-400 text-white px-4 py-2 rounded-md text-sm cursor-not-allowed frontend-action-button';
                actionButton.textContent = '❌ Frontend No Disponible';
                actionButton.disabled = true;
                actionButton.removeAttribute('href');
            }
        }
        
        // Start checking frontend status
        checkFrontendStatus();
        setInterval(checkFrontendStatus, 10000); // Every 10 seconds
        
        // Add loading states to links
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const originalText = this.textContent;
                this.textContent = '⏳ Conectando...';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            });
        });
    </script>
</body>
</html>
