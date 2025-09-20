<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info('🔍 [DEBUG] NewsController@index - Obteniendo lista de noticias');
        
        try {
            $query = News::with(['category:id,name,slug', 'author:id,name,email'])
                         ->published()
                         ->orderBy('published_at', 'desc');
            
            // Filtros opcionales
            if ($request->has('featured')) {
                $query->featured();
                Log::info('🔍 [DEBUG] Filtro: solo noticias destacadas');
            }
            
            if ($request->has('limit')) {
                $limit = min($request->limit, 50); // Máximo 50
                $query->limit($limit);
                Log::info("🔍 [DEBUG] Límite aplicado: {$limit}");
            }
            
            $news = $query->get();
            
            Log::info("✅ [DEBUG] Noticias obtenidas: {$news->count()} registros");
            
            return response()->json([
                'success' => true,
                'data' => $news,
                'count' => $news->count(),
                'debug' => [
                    'timestamp' => now(),
                    'source' => 'database',
                    'query_filters' => $request->only(['featured', 'limit'])
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [DEBUG] Error en NewsController@index: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener noticias',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'source' => 'database_error'
                ]
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('🔍 [DEBUG] NewsController@store - Creando nueva noticia');
        Log::info('🔍 [DEBUG] Datos recibidos: ' . json_encode($request->all()));
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'image_url' => 'nullable|url|max:500',
            'category_id' => 'nullable|exists:content_categories,id',
            'author_id' => 'nullable|exists:users,id',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            Log::warning('❌ [DEBUG] Validación fallida: ' . json_encode($validator->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors(),
                'debug' => [
                    'timestamp' => now(),
                    'validation_failed' => true
                ]
            ], 422);
        }

        try {
            $news = News::create($request->all());
            $news->load(['category:id,name,slug', 'author:id,name,email']);
            
            Log::info("✅ [DEBUG] Noticia creada exitosamente: {$news->id}");
            
            return response()->json([
                'success' => true,
                'data' => $news,
                'message' => 'Noticia creada exitosamente',
                'debug' => [
                    'timestamp' => now(),
                    'created_id' => $news->id,
                    'source' => 'database'
                ]
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('❌ [DEBUG] Error creando noticia: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al crear noticia',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'source' => 'database_error'
                ]
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        Log::info("🔍 [DEBUG] NewsController@show - Obteniendo noticia: {$id}");
        
        try {
            $news = News::with(['category:id,name,slug', 'author:id,name,email'])->findOrFail($id);
            
            // Incrementar contador de vistas
            $news->increment('views_count');
            
            Log::info("✅ [DEBUG] Noticia encontrada: {$news->title}");
            
            return response()->json([
                'success' => true,
                'data' => $news,
                'debug' => [
                    'timestamp' => now(),
                    'news_id' => $id,
                    'views_incremented' => true,
                    'source' => 'database'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error("❌ [DEBUG] Noticia no encontrada: {$id}");
            
            return response()->json([
                'success' => false,
                'message' => 'Noticia no encontrada',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'news_id' => $id,
                    'source' => 'database_error'
                ]
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        Log::info("🔍 [DEBUG] NewsController@update - Actualizando noticia: {$id}");
        Log::info('🔍 [DEBUG] Datos recibidos: ' . json_encode($request->all()));
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'excerpt' => 'nullable|string|max:500',
            'image_url' => 'nullable|url|max:500',
            'category_id' => 'nullable|exists:content_categories,id',
            'author_id' => 'nullable|exists:users,id',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            Log::warning('❌ [DEBUG] Validación fallida en update: ' . json_encode($validator->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors(),
                'debug' => [
                    'timestamp' => now(),
                    'validation_failed' => true
                ]
            ], 422);
        }

        try {
            $news = News::findOrFail($id);
            $news->update($request->all());
            $news->load(['category:id,name,slug', 'author:id,name,email']);
            
            Log::info("✅ [DEBUG] Noticia actualizada exitosamente: {$news->id}");
            
            return response()->json([
                'success' => true,
                'data' => $news,
                'message' => 'Noticia actualizada exitosamente',
                'debug' => [
                    'timestamp' => now(),
                    'updated_id' => $news->id,
                    'source' => 'database'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error("❌ [DEBUG] Error actualizando noticia {$id}: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar noticia',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'news_id' => $id,
                    'source' => 'database_error'
                ]
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Log::info("🔍 [DEBUG] NewsController@destroy - Eliminando noticia: {$id}");
        
        try {
            $news = News::findOrFail($id);
            $newsTitle = $news->title;
            $news->delete();
            
            Log::info("✅ [DEBUG] Noticia eliminada exitosamente: {$newsTitle}");
            
            return response()->json([
                'success' => true,
                'message' => 'Noticia eliminada exitosamente',
                'debug' => [
                    'timestamp' => now(),
                    'deleted_id' => $id,
                    'deleted_title' => $newsTitle,
                    'source' => 'database'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error("❌ [DEBUG] Error eliminando noticia {$id}: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar noticia',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'news_id' => $id,
                    'source' => 'database_error'
                ]
            ], 500);
        }
    }

    /**
     * Get featured news for homepage.
     */
    public function featured()
    {
        Log::info('🔍 [DEBUG] NewsController@featured - Obteniendo noticias destacadas');
        
        try {
            $featuredNews = News::with(['category:id,name,slug', 'author:id,name,email'])
                               ->featured()
                               ->published()
                               ->orderBy('published_at', 'desc')
                               ->limit(3)
                               ->get();
            
            Log::info("✅ [DEBUG] Noticias destacadas obtenidas: {$featuredNews->count()} registros");
            
            return response()->json([
                'success' => true,
                'data' => $featuredNews,
                'count' => $featuredNews->count(),
                'debug' => [
                    'timestamp' => now(),
                    'source' => 'database',
                    'filter' => 'featured_only'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [DEBUG] Error obteniendo noticias destacadas: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener noticias destacadas',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'source' => 'database_error'
                ]
            ], 500);
        }
    }
}
