<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Route;

class DocumentationController extends Controller
{
    /**
     * Generate and return sitemap XML
     */
    public function sitemap()
    {
        $baseUrl = config('app.url');
        $routes = collect(Route::getRoutes())->filter(function ($route) {
            return in_array('GET', $route->methods()) && 
                   !str_contains($route->uri(), 'api') &&
                   !str_contains($route->uri(), '{') &&
                   $route->uri() !== '/';
        });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        
        // Add homepage
        $xml .= "  <url>\n";
        $xml .= "    <loc>{$baseUrl}</loc>\n";
        $xml .= "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
        $xml .= "    <changefreq>daily</changefreq>\n";
        $xml .= "    <priority>1.0</priority>\n";
        $xml .= "  </url>\n";

        // Add other routes
        foreach ($routes as $route) {
            if ($route->uri() !== '/') {
                $xml .= "  <url>\n";
                $xml .= "    <loc>{$baseUrl}/{$route->uri()}</loc>\n";
                $xml .= "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
                $xml .= "    <changefreq>weekly</changefreq>\n";
                $xml .= "    <priority>0.8</priority>\n";
                $xml .= "  </url>\n";
            }
        }

        $xml .= '</urlset>';

        return response($xml)->header('Content-Type', 'application/xml');
    }

    /**
     * Generate ASCII sitemap representation
     */
    public function sitemapAscii()
    {
        $routes = collect(Route::getRoutes())->filter(function ($route) {
            return in_array('GET', $route->methods()) && 
                   !str_contains($route->uri(), 'api') &&
                   !str_contains($route->uri(), '{');
        });

        $ascii = "UBO INSIGHT MVP - SITEMAP STRUCTURE\n";
        $ascii .= "=====================================\n\n";
        $ascii .= "┌─ UBO Insight MVP\n";
        $ascii .= "│\n";
        $ascii .= "├─ 🏠 Homepage (/)\n";
        $ascii .= "│  └─ Status & Health Check\n";
        $ascii .= "│\n";
        $ascii .= "├─ 📊 API Endpoints\n";
        $ascii .= "│  ├─ /api/status\n";
        $ascii .= "│  ├─ /api/frontend-status\n";
        $ascii .= "│  └─ /api/v1/* (REST API)\n";
        $ascii .= "│\n";
        $ascii .= "├─ 📚 Documentation\n";
        $ascii .= "│  ├─ /docs/warnings\n";
        $ascii .= "│  ├─ /docs/context\n";
        $ascii .= "│  ├─ /docs/mapa\n";
        $ascii .= "│  └─ /docs/database\n";
        $ascii .= "│\n";
        $ascii .= "├─ 🗺️  Sitemap\n";
        $ascii .= "│  ├─ /sitemap.xml\n";
        $ascii .= "│  └─ /sitemap/ascii\n";
        $ascii .= "│\n";
        $ascii .= "└─ 🗄️  Database\n";
        $ascii .= "   ├─ /database/visual\n";
        $ascii .= "   └─ /database/schema\n";
        $ascii .= "\n";
        $ascii .= "ROUTE DETAILS:\n";
        $ascii .= "==============\n";

        foreach ($routes->sortBy('uri') as $route) {
            $methods = implode('|', $route->methods());
            $ascii .= sprintf("%-30s %s\n", $route->uri(), $methods);
        }

        return response($ascii)->header('Content-Type', 'text/plain');
    }

    /**
     * Get database schema information
     */
    public function databaseSchema()
    {
        try {
            $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");
            
            $schema = [];
            foreach ($tables as $table) {
                $tableName = $table->table_name;
                
                // Skip Laravel internal tables for cleaner view
                if (in_array($tableName, ['migrations', 'password_reset_tokens', 'personal_access_tokens', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs'])) {
                    continue;
                }
                
                $columns = DB::select("
                    SELECT 
                        column_name, 
                        data_type, 
                        is_nullable,
                        column_default,
                        character_maximum_length
                    FROM information_schema.columns 
                    WHERE table_name = ? 
                    ORDER BY ordinal_position
                ", [$tableName]);

                $foreignKeys = DB::select("
                    SELECT
                        kcu.column_name,
                        ccu.table_name AS foreign_table_name,
                        ccu.column_name AS foreign_column_name
                    FROM information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu
                        ON tc.constraint_name = kcu.constraint_name
                        AND tc.table_schema = kcu.table_schema
                    JOIN information_schema.constraint_column_usage AS ccu
                        ON ccu.constraint_name = tc.constraint_name
                        AND ccu.table_schema = tc.table_schema
                    WHERE tc.constraint_type = 'FOREIGN KEY'
                        AND tc.table_name = ?
                ", [$tableName]);

                $schema[$tableName] = [
                    'columns' => $columns,
                    'foreign_keys' => $foreignKeys
                ];
            }

            return response()->json([
                'success' => true,
                'schema' => $schema,
                'total_tables' => count($schema)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate ASCII database representation
     */
    public function databaseAscii()
    {
        try {
            $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");
            
            $ascii = "UBO INSIGHT MVP - DATABASE SCHEMA\n";
            $ascii .= "==================================\n\n";

            foreach ($tables as $table) {
                $tableName = $table->table_name;
                
                // Skip Laravel internal tables
                if (in_array($tableName, ['migrations', 'password_reset_tokens', 'personal_access_tokens', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs'])) {
                    continue;
                }

                $columns = DB::select("
                    SELECT 
                        column_name, 
                        data_type, 
                        is_nullable,
                        column_default
                    FROM information_schema.columns 
                    WHERE table_name = ? 
                    ORDER BY ordinal_position
                ", [$tableName]);

                $ascii .= "┌─ 📋 " . strtoupper($tableName) . "\n";
                $ascii .= "│\n";

                foreach ($columns as $column) {
                    $nullable = $column->is_nullable === 'YES' ? '(nullable)' : '(required)';
                    $type = $column->data_type;
                    $ascii .= "├─ " . $column->column_name . " : " . $type . " " . $nullable . "\n";
                }

                $ascii .= "│\n";
            }

            $ascii .= "\nRELATIONSHIPS:\n";
            $ascii .= "==============\n";
            $ascii .= "users ──┐\n";
            $ascii .= "        ├── news (author_id)\n";
            $ascii .= "        ├── bulletin_board (author_id)\n";
            $ascii .= "        └── projects (created_by)\n";
            $ascii .= "\n";
            $ascii .= "content_categories ──┐\n";
            $ascii .= "                     ├── news (category_id)\n";
            $ascii .= "                     ├── services (category_id)\n";
            $ascii .= "                     └── bulletin_board (category_id)\n";
            $ascii .= "\n";
            $ascii .= "news ←→ tags (many-to-many via news_tags)\n";

            return response($ascii)->header('Content-Type', 'text/plain');

        } catch (\Exception $e) {
            return response("Error generando ASCII de base de datos: " . $e->getMessage())
                ->header('Content-Type', 'text/plain');
        }
    }

    /**
     * Show visual database representation page
     */
    public function databaseVisual()
    {
        return view('database-visual');
    }
}
