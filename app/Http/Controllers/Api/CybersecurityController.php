<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CybersecurityItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CybersecurityController extends Controller
{
    /**
     * Get all active cybersecurity items
     */
    public function index(): JsonResponse
    {
        try {
            $items = CybersecurityItem::active()
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $items,
                'count' => $items->count(),
                'message' => 'Cybersecurity items retrieved successfully',
                'debug' => [
                    'endpoint' => 'cybersecurity',
                    'timestamp' => now()->toISOString(),
                    'total_items' => CybersecurityItem::count(),
                    'active_items' => $items->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving cybersecurity items',
                'error' => $e->getMessage(),
                'debug' => [
                    'endpoint' => 'cybersecurity',
                    'timestamp' => now()->toISOString()
                ]
            ], 500);
        }
    }

    /**
     * Get cybersecurity items by type
     */
    public function byType($type): JsonResponse
    {
        try {
            $items = CybersecurityItem::active()
                ->byType($type)
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $items,
                'count' => $items->count(),
                'message' => "Cybersecurity items of type '{$type}' retrieved successfully",
                'debug' => [
                    'endpoint' => "cybersecurity/type/{$type}",
                    'timestamp' => now()->toISOString(),
                    'type' => $type,
                    'items_found' => $items->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving cybersecurity items by type',
                'error' => $e->getMessage(),
                'debug' => [
                    'endpoint' => "cybersecurity/type/{$type}",
                    'timestamp' => now()->toISOString(),
                    'type' => $type
                ]
            ], 500);
        }
    }
}
