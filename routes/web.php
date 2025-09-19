<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StatusController;

// Status page as homepage
Route::get('/', [StatusController::class, 'index'])->name('status');
Route::get('/status', [StatusController::class, 'index'])->name('status.index');
Route::get('/api/status', [StatusController::class, 'api'])->name('status.api');

// Documentation routes
Route::get('/docs/warnings', function () {
    $content = file_get_contents(base_path('WARNINGS.md'));
    return response($content)->header('Content-Type', 'text/plain');
});

Route::get('/docs/prompt', function () {
    $content = file_get_contents(base_path('PROMPT.md'));
    return response($content)->header('Content-Type', 'text/plain');
});

Route::get('/docs/mapa', function () {
    $content = file_get_contents(base_path('MAPA.md'));
    return response($content)->header('Content-Type', 'text/plain');
});

Route::get('/docs/database', function () {
    $content = file_get_contents(base_path('basededatos.md'));
    return response($content)->header('Content-Type', 'text/plain');
});
