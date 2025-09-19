<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Project;
use App\Models\User;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Ejecutar migraciones y seeders para cada test
        $this->artisan('migrate');
        $this->seed();
    }

    /**
     * Test getting all projects.
     */
    public function test_can_get_all_projects(): void
    {
        $response = $this->getJson('/api/v1/projects');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         '*' => [
                             'id',
                             'name',
                             'description',
                             'status',
                             'progress',
                             'budget',
                             'spent',
                             'manager'
                         ]
                     ],
                     'count',
                     'debug'
                 ])
                 ->assertJson(['success' => true]);
    }

    /**
     * Test creating a new project.
     */
    public function test_can_create_project(): void
    {
        $projectData = [
            'name' => 'Test Project API',
            'description' => 'Proyecto creado via test automatizado',
            'status' => 'planning',
            'progress' => 0,
            'budget' => 25000,
            'spent' => 0,
            'start_date' => '2024-12-01',
            'end_date' => '2025-03-31',
            'team_size' => 4,
            'priority' => 'medium',
            'tags' => ['test', 'api', 'automation']
        ];

        $response = $this->postJson('/api/v1/projects', $projectData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'id',
                         'name',
                         'description',
                         'status',
                         'progress',
                         'budget'
                     ],
                     'message',
                     'debug'
                 ])
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'name' => 'Test Project API',
                         'status' => 'planning'
                     ]
                 ]);

        // Verificar que se guardó en la base de datos
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project API',
            'status' => 'planning'
        ]);
    }

    /**
     * Test updating a project.
     */
    public function test_can_update_project(): void
    {
        // Crear un proyecto primero
        $project = Project::factory()->create([
            'name' => 'Original Project',
            'status' => 'planning',
            'progress' => 10
        ]);

        $updateData = [
            'name' => 'Updated Project Name',
            'status' => 'in-progress',
            'progress' => 25
        ];

        $response = $this->putJson("/api/v1/projects/{$project->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data',
                     'message',
                     'debug'
                 ])
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'name' => 'Updated Project Name',
                         'status' => 'in-progress',
                         'progress' => 25
                     ]
                 ]);

        // Verificar que se actualizó en la base de datos
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project Name',
            'status' => 'in-progress'
        ]);
    }

    /**
     * Test deleting a project.
     */
    public function test_can_delete_project(): void
    {
        // Crear un proyecto primero
        $project = Project::factory()->create([
            'name' => 'Project to Delete'
        ]);

        $response = $this->deleteJson("/api/v1/projects/{$project->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Proyecto eliminado exitosamente'
                 ]);

        // Verificar que se eliminó de la base de datos
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id
        ]);
    }

    /**
     * Test getting project statistics.
     */
    public function test_can_get_project_statistics(): void
    {
        $response = $this->getJson('/api/v1/projects-stats');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'total_projects',
                         'active_projects',
                         'by_status' => [
                             'planning',
                             'in_progress',
                             'completed',
                             'on_hold'
                         ],
                         'by_priority' => [
                             'high',
                             'medium',
                             'low'
                         ],
                         'budget_stats' => [
                             'total_budget',
                             'total_spent',
                             'avg_utilization'
                         ]
                     ],
                     'debug'
                 ])
                 ->assertJson(['success' => true]);
    }

    /**
     * Test validation errors when creating project with invalid data.
     */
    public function test_validation_errors_when_creating_project_with_invalid_data(): void
    {
        $invalidData = [
            'name' => '', // Required field empty
            'status' => 'invalid-status', // Invalid status
            'progress' => 150, // Progress > 100
            'budget' => -1000 // Negative budget
        ];

        $response = $this->postJson('/api/v1/projects', $invalidData);

        $response->assertStatus(422)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'errors',
                     'debug'
                 ])
                 ->assertJson(['success' => false]);
    }

    /**
     * Test 404 error when trying to access non-existent project.
     */
    public function test_returns_404_for_non_existent_project(): void
    {
        $fakeId = '00000000-0000-0000-0000-000000000000';
        
        $response = $this->getJson("/api/v1/projects/{$fakeId}");

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Proyecto no encontrado'
                 ]);
    }
}
