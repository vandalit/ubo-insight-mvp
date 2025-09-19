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
                    <h4 class="font-semibold text-ubo-primary mb-2">Frontend Angular</h4>
                    <p class="text-sm text-gray-600 mb-3">Servidor de desarrollo del frontend</p>
                    <div class="space-y-2">
                        <a href="http://localhost:4200" target="_blank" 
                           class="inline-block bg-ubo-primary text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition-colors">
                            🌐 Abrir Frontend
                        </a>
                        <div class="text-xs text-gray-500">
                            <code class="bg-gray-100 px-2 py-1 rounded">cd frontend && npm start</code>
                        </div>
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
                <a href="/docs/prompt" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 class="font-semibold text-blue-600 mb-1">🤖 PROMPT.md</h4>
                    <p class="text-xs text-gray-600">Guías para desarrollo futuro</p>
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

        <!-- Footer -->
        <div class="text-center mt-8 text-gray-500 text-sm fade-in" style="animation-delay: 0.7s">
            <p>Universidad Bernardo O'Higgins - Departamento de Tecnologías de la Información</p>
            <p class="mt-1">Actualizado automáticamente cada 30 segundos</p>
        </div>
    </div>

    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => {
            location.reload();
        }, 30000);
        
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
