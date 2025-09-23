<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\DocumentationController;

// Status page as homepage
Route::get('/', [StatusController::class, 'index'])->name('status');
Route::get('/status', [StatusController::class, 'index'])->name('status.index');
Route::get('/api/status', [StatusController::class, 'api'])->name('status.api');
Route::get('/api/frontend-status', [StatusController::class, 'frontendStatus'])->name('status.frontend');

// Documentation routes
Route::get('/docs/warnings', function () {
    $content = file_get_contents(base_path('warnings.md'));
    return response($content)->header('Content-Type', 'text/plain');
});

Route::get('/docs/context', function () {
    $content = file_get_contents(base_path('context.md'));
    return response($content)->header('Content-Type', 'text/plain');
});

// Redirect legacy prompt route to context
Route::get('/docs/prompt', function () {
    return redirect('/docs/context');
});

Route::get('/docs/mapa', function () {
    $content = file_get_contents(base_path('mapa.md'));
    return response($content)->header('Content-Type', 'text/plain');
});

Route::get('/docs/database', function () {
    $content = file_get_contents(base_path('basededatos.md'));
    return response($content)->header('Content-Type', 'text/plain');
});

// Sitemap routes
Route::get('/sitemap.xml', [DocumentationController::class, 'sitemap'])->name('sitemap.xml');
Route::get('/sitemap/ascii', [DocumentationController::class, 'sitemapAscii'])->name('sitemap.ascii');

// Database documentation routes
Route::get('/database/schema', [DocumentationController::class, 'databaseSchema'])->name('database.schema');
Route::get('/database/ascii', [DocumentationController::class, 'databaseAscii'])->name('database.ascii');
Route::get('/database/visual', [DocumentationController::class, 'databaseVisual'])->name('database.visual');
