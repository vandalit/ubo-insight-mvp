<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BulletinBoard;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BulletinBoardController extends Controller
{
    /**
     * Get all active bulletin board items
     */
    public function index(): JsonResponse
    {
        try {
            $items = BulletinBoard::with(['category:id,name,slug', 'author:id,name,email'])
                ->where('is_published', true)
                ->where('valid_until', '>=', now()->toDateString())
                ->orderBy('is_urgent', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $items,
                'count' => $items->count(),
                'message' => 'Bulletin board items retrieved successfully',
                'debug' => [
                    'endpoint' => 'bulletin-board',
                    'timestamp' => now()->toISOString(),
                    'total_items' => BulletinBoard::count(),
                    'active_items' => $items->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving bulletin board items',
                'error' => $e->getMessage(),
                'debug' => [
                    'endpoint' => 'bulletin-board',
                    'timestamp' => now()->toISOString()
                ]
            ], 500);
        }
    }

    /**
     * Get bulletin board items by type
     */
    public function byType($type): JsonResponse
    {
        try {
            $items = BulletinBoard::with(['category:id,name,slug', 'author:id,name,email'])
                ->where('is_published', true)
                ->where('valid_until', '>=', now()->toDateString())
                ->where('type', $type)
                ->orderBy('is_urgent', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $items,
                'count' => $items->count(),
                'message' => "Bulletin board items of type '{$type}' retrieved successfully",
                'debug' => [
                    'endpoint' => "bulletin-board/type/{$type}",
                    'timestamp' => now()->toISOString(),
                    'type' => $type,
                    'items_found' => $items->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving bulletin board items by type',
                'error' => $e->getMessage(),
                'debug' => [
                    'endpoint' => "bulletin-board/type/{$type}",
                    'timestamp' => now()->toISOString(),
                    'type' => $type
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
