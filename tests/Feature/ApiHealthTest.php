<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ApiHealthTest extends TestCase
{
    /**
     * Test API health endpoint.
     */
    public function test_api_health_endpoint_returns_ok(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'timestamp',
                     'service'
                 ])
                 ->assertJson([
                     'status' => 'ok',
                     'service' => 'UBO Insight API'
                 ]);
    }

    /**
     * Test API debug endpoint.
     */
    public function test_api_debug_endpoint_returns_system_info(): void
    {
        $response = $this->getJson('/api/debug');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'timestamp',
                     'database_status',
                     'debug' => [
                         'laravel_version',
                         'php_version',
                         'environment'
                     ]
                 ])
                 ->assertJson([
                     'success' => true,
                     'database_status' => 'connected'
                 ]);
    }

    /**
     * Test database connection.
     */
    public function test_database_connection_works(): void
    {
        // Test that we can connect to the database
        $this->assertDatabaseCount('users', 4);
        $this->assertDatabaseCount('content_categories', 4);
        $this->assertDatabaseCount('projects', 6);
        $this->assertDatabaseCount('news', 7);
    }

    /**
     * Test API v1 routes are accessible.
     */
    public function test_api_v1_routes_are_accessible(): void
    {
        // Test projects endpoint
        $response = $this->getJson('/api/v1/projects');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data',
                     'count',
                     'debug'
                 ]);

        // Test news endpoint
        $response = $this->getJson('/api/v1/news');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data',
                     'count',
                     'debug'
                 ]);
    }

    /**
     * Test API returns proper error for non-existent endpoints.
     */
    public function test_api_returns_404_for_non_existent_endpoints(): void
    {
        $response = $this->getJson('/api/v1/non-existent-endpoint');
        
        $response->assertStatus(404)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'debug'
                 ])
                 ->assertJson([
                     'success' => false
                 ]);
    }
}
