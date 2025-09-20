<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomeSlide;
use App\Models\HomeMetric;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    /**
     * Get all active home slides ordered by order_index
     */
    public function slides(): JsonResponse
    {
        try {
            $slides = HomeSlide::active()
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $slides,
                'count' => $slides->count(),
                'message' => 'Home slides retrieved successfully',
                'debug' => [
                    'endpoint' => 'home/slides',
                    'timestamp' => now()->toISOString(),
                    'total_slides' => HomeSlide::count(),
                    'active_slides' => $slides->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving home slides',
                'error' => $e->getMessage(),
                'debug' => [
                    'endpoint' => 'home/slides',
                    'timestamp' => now()->toISOString()
                ]
            ], 500);
        }
    }

    /**
     * Get all active home metrics ordered by order_index
     */
    public function metrics(): JsonResponse
    {
        try {
            $metrics = HomeMetric::active()
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $metrics,
                'count' => $metrics->count(),
                'message' => 'Home metrics retrieved successfully',
                'debug' => [
                    'endpoint' => 'home/metrics',
                    'timestamp' => now()->toISOString(),
                    'total_metrics' => HomeMetric::count(),
                    'active_metrics' => $metrics->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving home metrics',
                'error' => $e->getMessage(),
                'debug' => [
                    'endpoint' => 'home/metrics',
                    'timestamp' => now()->toISOString()
                ]
            ], 500);
        }
    }

    /**
     * Get home overview data (slides + metrics)
     */
    public function overview(): JsonResponse
    {
        try {
            $slides = HomeSlide::active()
                ->ordered()
                ->get();

            $metrics = HomeMetric::active()
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'slides' => $slides,
                    'metrics' => $metrics
                ],
                'count' => [
                    'slides' => $slides->count(),
                    'metrics' => $metrics->count()
                ],
                'message' => 'Home overview data retrieved successfully',
                'debug' => [
                    'endpoint' => 'home/overview',
                    'timestamp' => now()->toISOString(),
                    'total_slides' => HomeSlide::count(),
                    'active_slides' => $slides->count(),
                    'total_metrics' => HomeMetric::count(),
                    'active_metrics' => $metrics->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving home overview data',
                'error' => $e->getMessage(),
                'debug' => [
                    'endpoint' => 'home/overview',
                    'timestamp' => now()->toISOString()
                ]
            ], 500);
        }
    }
}
