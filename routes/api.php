<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API Routes for UBO Insight MVP
Route::prefix('v1')->group(function () {
    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'message' => 'UBO Insight API is running',
            'timestamp' => now()
        ]);
    });

    // Home data
    Route::get('/home/slides', function () {
        $slides = json_decode(file_get_contents(public_path('assets/data/home-slides.json')), true);
        return response()->json($slides);
    });

    Route::get('/home/metrics', function () {
        $metrics = json_decode(file_get_contents(public_path('assets/data/home-metrics.json')), true);
        return response()->json($metrics);
    });

    // Servicios
    Route::get('/servicios', function () {
        $servicios = json_decode(file_get_contents(public_path('assets/data/servicios.json')), true);
        return response()->json($servicios);
    });

    // Ciberseguridad
    Route::get('/ciberseguridad', function () {
        $ciberseguridad = json_decode(file_get_contents(public_path('assets/data/ciberseguridad.json')), true);
        return response()->json($ciberseguridad);
    });

    // Noticias
    Route::get('/noticias', function () {
        $noticias = json_decode(file_get_contents(public_path('assets/data/noticias.json')), true);
        return response()->json($noticias);
    });

    // Diario Mural
    Route::get('/diario-mural', function () {
        $diarioMural = json_decode(file_get_contents(public_path('assets/data/diario-mural.json')), true);
        return response()->json($diarioMural);
    });
});
