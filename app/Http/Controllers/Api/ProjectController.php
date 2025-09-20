<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info('🔍 [DEBUG] ProjectController@index - Obteniendo lista de proyectos');
        
        try {
            $query = Project::with('manager:id,name,email');
            
            // Filtros opcionales
            if ($request->has('status')) {
                $query->byStatus($request->status);
                Log::info("🔍 [DEBUG] Filtro por status: {$request->status}");
            }
            
            if ($request->has('active')) {
                $query->active();
                Log::info('🔍 [DEBUG] Filtro solo proyectos activos');
            }
            
            $projects = $query->orderBy('created_at', 'desc')->get();
            
            Log::info("✅ [DEBUG] Proyectos obtenidos: {$projects->count()} registros");
            
            return response()->json([
                'success' => true,
                'data' => $projects,
                'count' => $projects->count(),
                'debug' => [
                    'timestamp' => now(),
                    'source' => 'database',
                    'query_filters' => $request->only(['status', 'active'])
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [DEBUG] Error en ProjectController@index: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener proyectos',
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
        Log::info('🔍 [DEBUG] ProjectController@store - Creando nuevo proyecto');
        Log::info('🔍 [DEBUG] Datos recibidos: ' . json_encode($request->all()));
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:planning,in-progress,completed,on-hold',
            'progress' => 'integer|min:0|max:100',
            'budget' => 'numeric|min:0',
            'spent' => 'numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'manager_id' => 'nullable|exists:users,id',
            'team_size' => 'integer|min:1',
            'priority' => 'required|in:low,medium,high',
            'tags' => 'nullable|array',
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
            $project = Project::create($request->all());
            $project->load('manager:id,name,email');
            
            Log::info("✅ [DEBUG] Proyecto creado exitosamente: {$project->id}");
            
            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Proyecto creado exitosamente',
                'debug' => [
                    'timestamp' => now(),
                    'created_id' => $project->id,
                    'source' => 'database'
                ]
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('❌ [DEBUG] Error creando proyecto: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al crear proyecto',
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
        Log::info("🔍 [DEBUG] ProjectController@show - Obteniendo proyecto: {$id}");
        
        try {
            $project = Project::with('manager:id,name,email')->findOrFail($id);
            
            Log::info("✅ [DEBUG] Proyecto encontrado: {$project->name}");
            
            return response()->json([
                'success' => true,
                'data' => $project,
                'debug' => [
                    'timestamp' => now(),
                    'project_id' => $id,
                    'source' => 'database'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error("❌ [DEBUG] Proyecto no encontrado: {$id}");
            
            return response()->json([
                'success' => false,
                'message' => 'Proyecto no encontrado',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'project_id' => $id,
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
        Log::info("🔍 [DEBUG] ProjectController@update - Actualizando proyecto: {$id}");
        Log::info('🔍 [DEBUG] Datos recibidos: ' . json_encode($request->all()));
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:planning,in-progress,completed,on-hold',
            'progress' => 'integer|min:0|max:100',
            'budget' => 'numeric|min:0',
            'spent' => 'numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'manager_id' => 'nullable|exists:users,id',
            'team_size' => 'integer|min:1',
            'priority' => 'sometimes|required|in:low,medium,high',
            'tags' => 'nullable|array',
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
            $project = Project::findOrFail($id);
            $project->update($request->all());
            $project->load('manager:id,name,email');
            
            Log::info("✅ [DEBUG] Proyecto actualizado exitosamente: {$project->id}");
            
            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Proyecto actualizado exitosamente',
                'debug' => [
                    'timestamp' => now(),
                    'updated_id' => $project->id,
                    'source' => 'database'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error("❌ [DEBUG] Error actualizando proyecto {$id}: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar proyecto',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'project_id' => $id,
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
        Log::info("🔍 [DEBUG] ProjectController@destroy - Eliminando proyecto: {$id}");
        
        try {
            $project = Project::findOrFail($id);
            $projectName = $project->name;
            $project->delete();
            
            Log::info("✅ [DEBUG] Proyecto eliminado exitosamente: {$projectName}");
            
            return response()->json([
                'success' => true,
                'message' => 'Proyecto eliminado exitosamente',
                'debug' => [
                    'timestamp' => now(),
                    'deleted_id' => $id,
                    'deleted_name' => $projectName,
                    'source' => 'database'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error("❌ [DEBUG] Error eliminando proyecto {$id}: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar proyecto',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'project_id' => $id,
                    'source' => 'database_error'
                ]
            ], 500);
        }
    }

    /**
     * Get project statistics for dashboard.
     */
    public function stats()
    {
        Log::info('🔍 [DEBUG] ProjectController@stats - Obteniendo estadísticas de proyectos');
        
        try {
            $stats = [
                'total_projects' => Project::count(),
                'active_projects' => Project::active()->count(),
                'by_status' => [
                    'planning' => Project::byStatus('planning')->count(),
                    'in_progress' => Project::byStatus('in-progress')->count(),
                    'completed' => Project::byStatus('completed')->count(),
                    'on_hold' => Project::byStatus('on-hold')->count(),
                ],
                'by_priority' => [
                    'high' => Project::where('priority', 'high')->count(),
                    'medium' => Project::where('priority', 'medium')->count(),
                    'low' => Project::where('priority', 'low')->count(),
                ],
                'budget_stats' => [
                    'total_budget' => Project::sum('budget'),
                    'total_spent' => Project::sum('spent'),
                    'avg_utilization' => Project::avg('progress'),
                ]
            ];
            
            Log::info("✅ [DEBUG] Estadísticas calculadas: {$stats['total_projects']} proyectos totales");
            
            return response()->json([
                'success' => true,
                'data' => $stats,
                'debug' => [
                    'timestamp' => now(),
                    'source' => 'database_aggregation'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [DEBUG] Error obteniendo estadísticas: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage(),
                'debug' => [
                    'timestamp' => now(),
                    'source' => 'database_error'
                ]
            ], 500);
        }
    }
}
