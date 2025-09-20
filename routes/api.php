<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\BulletinBoardController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\CybersecurityController;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Debug endpoint
Route::get('/debug', function () {
    Log::info('🔍 [DEBUG] API Debug endpoint called');
    return response()->json([
        'success' => true,
        'message' => 'UBO Insight API funcionando correctamente',
        'timestamp' => now(),
        'database_status' => 'connected',
        'debug' => [
            'laravel_version' => app()->version(),
            'php_version' => PHP_VERSION,
            'environment' => app()->environment()
        ]
    ]);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'UBO Insight API'
    ]);
});

// API v1 routes
Route::prefix('v1')->group(function () {
    
    // Projects CRUD with debug
    Route::apiResource('projects', ProjectController::class);
    Route::get('projects-stats', [ProjectController::class, 'stats']);
    
    // Services CRUD
    Route::apiResource('services', ServiceController::class);
    
    // Cybersecurity endpoints
    Route::get('cybersecurity', [CybersecurityController::class, 'index']);
    Route::get('cybersecurity/type/{type}', [CybersecurityController::class, 'byType']);
    
    // News CRUD
    Route::apiResource('news', NewsController::class);
    Route::get('news-featured', [NewsController::class, 'featured']);
    
    // Bulletin Board (Diario Mural) CRUD
    Route::apiResource('bulletin-board', BulletinBoardController::class);
    Route::get('bulletin-board/type/{type}', [BulletinBoardController::class, 'byType']);
    
    // Users CRUD
    Route::apiResource('users', UserController::class);
    
    // Dashboard endpoints
    Route::get('dashboard/overview', [DashboardController::class, 'overview']);
    Route::get('dashboard/ciberseguridad', [DashboardController::class, 'ciberseguridad']);
    Route::get('dashboard/proyectos', [DashboardController::class, 'proyectos']);
    
    // Home endpoints
    Route::get('home/slides', [HomeController::class, 'slides']);
    Route::get('home/metrics', [HomeController::class, 'metrics']);
    Route::get('home/overview', [HomeController::class, 'overview']);
    
    // Legacy endpoints for frontend compatibility
    
    Route::get('servicios', function () {
        Log::info('🔍 [DEBUG] Legacy endpoint: servicios - redirecting to /api/v1/services');
        return redirect('/api/v1/services');
    });
    
    Route::get('ciberseguridad', function () {
        Log::info('🔍 [DEBUG] Legacy endpoint: ciberseguridad - data source changed');
        return response()->json([
            'success' => false,
            'message' => 'Endpoint migrado a base de datos',
            'debug' => [
                'legacy_endpoint' => true,
                'migration_required' => true,
                'timestamp' => now()
            ]
        ], 410); // Gone
    });
    
    Route::get('noticias', function () {
        Log::info('🔍 [DEBUG] Legacy endpoint: noticias - data source changed');
        return response()->json([
            'success' => false,
            'message' => 'Endpoint migrado a base de datos',
            'debug' => [
                'legacy_endpoint' => true,
                'migration_required' => true,
                'timestamp' => now()
            ]
        ], 410); // Gone
    });
    
    Route::get('diario-mural', function () {
        Log::info('🔍 [DEBUG] Legacy endpoint: diario-mural - data source changed');
        return response()->json([
            'success' => false,
            'message' => 'Endpoint migrado a base de datos',
            'debug' => [
                'legacy_endpoint' => true,
                'migration_required' => true,
                'timestamp' => now()
            ]
        ], 410); // Gone
    });
});

// Catch-all for debugging
Route::fallback(function () {
    Log::warning('🔍 [DEBUG] API endpoint not found: ' . request()->path());
    return response()->json([
        'success' => false,
        'message' => 'Endpoint no encontrado',
        'debug' => [
            'requested_path' => request()->path(),
            'method' => request()->method(),
            'timestamp' => now(),
            'available_endpoints' => [
                'GET /api/debug',
                'GET /api/health', 
                'GET /api/v1/projects',
                'POST /api/v1/projects',
                'GET /api/v1/projects/{id}',
                'PUT /api/v1/projects/{id}',
                'DELETE /api/v1/projects/{id}',
                'GET /api/v1/projects-stats'
            ]
        ]
    ], 404);
});
