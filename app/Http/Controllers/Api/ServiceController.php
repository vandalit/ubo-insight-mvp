<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    /**
     * Get all active services with their actions
     */
    public function index(): JsonResponse
    {
        try {
            $services = Service::with(['actions' => function($query) {
                $query->where('is_active', true);
            }])
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

            // Transform data to match frontend expectations
            $transformedServices = $services->map(function($service) {
                $action = $service->actions->first();
                
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'description' => $service->description,
                    'details' => $service->details,
                    'image' => $service->image_url,
                    'hasButton' => $action ? true : false,
                    'buttonText' => $action ? $action->button_text : '',
                    'buttonAction' => $action ? $action->action_value : ''
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedServices,
                'count' => $transformedServices->count(),
                'message' => 'Services retrieved successfully',
                'debug' => [
                    'endpoint' => 'services',
                    'timestamp' => now()->toISOString(),
                    'total_services' => Service::count(),
                    'active_services' => $services->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving services',
                'error' => $e->getMessage(),
                'debug' => [
                    'endpoint' => 'services',
                    'timestamp' => now()->toISOString()
                ]
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
