<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\HomeSlide;
use App\Models\Service;
use App\Models\News;

class StatusController extends Controller
{
    public function index()
    {
        $status = $this->getSystemStatus();
        return view('status.index', compact('status'));
    }

    public function api()
    {
        $status = $this->getSystemStatus();
        return response()->json([
            'success' => true,
            'data' => $status,
            'timestamp' => now()->toISOString()
        ]);
    }

    public function frontendStatus()
    {
        $frontendStatus = $this->checkFrontendStatus();
        return response()->json([
            'success' => true,
            'data' => $frontendStatus,
            'timestamp' => now()->toISOString()
        ]);
    }

    private function getSystemStatus()
    {
        $status = [
            'system' => [
                'name' => 'UBO Insight MVP',
                'version' => '1.0.0',
                'environment' => config('app.env'),
                'debug' => config('app.debug'),
                'timestamp' => now()->toISOString()
            ],
            'checks' => []
        ];

        // Database Connection Check
        try {
            DB::connection()->getPdo();
            $status['checks']['database'] = [
                'name' => 'Database Connection',
                'status' => 'healthy',
                'message' => 'PostgreSQL connected successfully',
                'details' => [
                    'driver' => config('database.default'),
                    'host' => config('database.connections.pgsql.host'),
                    'database' => config('database.connections.pgsql.database')
                ]
            ];
        } catch (\Exception $e) {
            $status['checks']['database'] = [
                'name' => 'Database Connection',
                'status' => 'error',
                'message' => 'Database connection failed',
                'error' => $e->getMessage()
            ];
        }

        // Cache Check
        try {
            Cache::put('health_check', 'ok', 60);
            $cacheValue = Cache::get('health_check');
            $status['checks']['cache'] = [
                'name' => 'Cache System',
                'status' => $cacheValue === 'ok' ? 'healthy' : 'warning',
                'message' => $cacheValue === 'ok' ? 'Cache working correctly' : 'Cache not responding',
                'details' => [
                    'driver' => config('cache.default')
                ]
            ];
        } catch (\Exception $e) {
            $status['checks']['cache'] = [
                'name' => 'Cache System',
                'status' => 'error',
                'message' => 'Cache system failed',
                'error' => $e->getMessage()
            ];
        }

        // Data Integrity Check
        try {
            $homeSlides = HomeSlide::count();
            $services = Service::count();
            $news = News::count();
            
            $status['checks']['data'] = [
                'name' => 'Data Integrity',
                'status' => ($homeSlides > 0 && $services > 0) ? 'healthy' : 'warning',
                'message' => 'Core data tables populated',
                'details' => [
                    'home_slides' => $homeSlides,
                    'services' => $services,
                    'news' => $news
                ]
            ];
        } catch (\Exception $e) {
            $status['checks']['data'] = [
                'name' => 'Data Integrity',
                'status' => 'error',
                'message' => 'Data check failed',
                'error' => $e->getMessage()
            ];
        }

        // API Endpoints Check
        $apiEndpoints = [
            '/api/v1/home/slides',
            '/api/v1/services',
            '/api/v1/news',
            '/api/v1/cybersecurity'
        ];

        $apiStatus = [];
        foreach ($apiEndpoints as $endpoint) {
            try {
                $response = app()->make('Illuminate\Contracts\Http\Kernel')
                    ->handle(\Illuminate\Http\Request::create($endpoint, 'GET'));
                
                $apiStatus[] = [
                    'endpoint' => $endpoint,
                    'status' => $response->getStatusCode() === 200 ? 'healthy' : 'warning',
                    'code' => $response->getStatusCode()
                ];
            } catch (\Exception $e) {
                $apiStatus[] = [
                    'endpoint' => $endpoint,
                    'status' => 'error',
                    'error' => $e->getMessage()
                ];
            }
        }

        $status['checks']['api'] = [
            'name' => 'API Endpoints',
            'status' => collect($apiStatus)->every(fn($api) => $api['status'] === 'healthy') ? 'healthy' : 'warning',
            'message' => 'Core API endpoints status',
            'details' => $apiStatus
        ];

        // Frontend Connectivity Check
        $frontendStatus = $this->checkFrontendStatus();
        $status['checks']['frontend'] = $frontendStatus;

        return $status;
    }

    private function checkFrontendStatus()
    {
        $frontendUrl = 'http://localhost:4200';
        $portCheckUrl = 'http://127.0.0.1:4200';
        
        try {
            // Verificar si el puerto 4200 está abierto
            $context = stream_context_create([
                'http' => [
                    'timeout' => 3, // 3 segundos timeout
                    'method' => 'GET',
                    'header' => [
                        'User-Agent: UBO-Insight-Backend/1.0',
                        'Accept: text/html,application/json'
                    ]
                ]
            ]);

            // Intentar conectar al frontend
            $response = @file_get_contents($frontendUrl, false, $context);
            
            if ($response !== false) {
                // Verificar si es realmente Angular
                $isAngular = strpos($response, 'ng-version') !== false || 
                           strpos($response, 'angular') !== false ||
                           strpos($response, 'app-root') !== false;
                
                if ($isAngular) {
                    return [
                        'name' => 'Frontend Angular',
                        'status' => 'healthy',
                        'message' => 'Angular development server is running',
                        'details' => [
                            'url' => $frontendUrl,
                            'port' => 4200,
                            'detected' => 'Angular Application',
                            'response_size' => strlen($response) . ' bytes',
                            'last_check' => now()->toISOString()
                        ]
                    ];
                } else {
                    return [
                        'name' => 'Frontend Angular',
                        'status' => 'warning',
                        'message' => 'Port 4200 is responding but may not be Angular',
                        'details' => [
                            'url' => $frontendUrl,
                            'port' => 4200,
                            'detected' => 'Unknown application',
                            'response_size' => strlen($response) . ' bytes'
                        ]
                    ];
                }
            }
        } catch (\Exception $e) {
            // Si falla la conexión HTTP, intentar verificar el puerto directamente
            $portOpen = $this->isPortOpen('127.0.0.1', 4200);
            
            if ($portOpen) {
                return [
                    'name' => 'Frontend Angular',
                    'status' => 'warning',
                    'message' => 'Port 4200 is open but HTTP request failed',
                    'details' => [
                        'url' => $frontendUrl,
                        'port' => 4200,
                        'port_status' => 'open',
                        'http_error' => $e->getMessage()
                    ]
                ];
            }
        }

        // Si llegamos aquí, el frontend no está corriendo
        return [
            'name' => 'Frontend Angular',
            'status' => 'error',
            'message' => 'Angular development server is not running',
            'details' => [
                'expected_url' => $frontendUrl,
                'expected_port' => 4200,
                'status' => 'offline',
                'command_to_start' => 'cd frontend && npm start',
                'alternative_command' => 'cd frontend && ng serve'
            ]
        ];
    }

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
}
