<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUser = User::where('email', 'uboinsight@ubo.cl')->first();
        $devUser = User::where('email', 'dev@ubo.cl')->first();
        
        $projects = [
            [
                'name' => 'Modernización Sistema Académico',
                'description' => 'Actualización completa del sistema de gestión académica con nuevas funcionalidades y mejor UX.',
                'status' => 'in-progress',
                'progress' => 65,
                'budget' => 150000.00,
                'spent' => 97500.00,
                'start_date' => '2024-01-15',
                'end_date' => '2024-12-31',
                'manager_id' => $adminUser?->id,
                'team_size' => 8,
                'priority' => 'high',
                'tags' => ['sistema', 'académico', 'modernización'],
                'is_active' => true,
            ],
            [
                'name' => 'Implementación Dashboard Analytics',
                'description' => 'Desarrollo de dashboards interactivos para análisis de datos institucionales.',
                'status' => 'planning',
                'progress' => 15,
                'budget' => 75000.00,
                'spent' => 11250.00,
                'start_date' => '2024-03-01',
                'end_date' => '2024-08-30',
                'manager_id' => $devUser?->id,
                'team_size' => 5,
                'priority' => 'medium',
                'tags' => ['analytics', 'dashboard', 'datos'],
                'is_active' => true,
            ],
            [
                'name' => 'Migración a Cloud AWS',
                'description' => 'Migración de infraestructura local a servicios cloud de Amazon Web Services.',
                'status' => 'completed',
                'progress' => 100,
                'budget' => 200000.00,
                'spent' => 185000.00,
                'start_date' => '2023-06-01',
                'end_date' => '2023-12-15',
                'manager_id' => $adminUser?->id,
                'team_size' => 12,
                'priority' => 'high',
                'tags' => ['cloud', 'aws', 'infraestructura'],
                'is_active' => true,
            ],
            [
                'name' => 'App Móvil Estudiantes',
                'description' => 'Desarrollo de aplicación móvil para servicios estudiantiles.',
                'status' => 'on-hold',
                'progress' => 30,
                'budget' => 90000.00,
                'spent' => 27000.00,
                'start_date' => '2024-02-01',
                'end_date' => '2024-10-31',
                'manager_id' => $devUser?->id,
                'team_size' => 6,
                'priority' => 'low',
                'tags' => ['móvil', 'estudiantes', 'app'],
                'is_active' => false,
            ],
            [
                'name' => 'Seguridad Cibernética 2024',
                'description' => 'Implementación de nuevas medidas de seguridad y auditoría de sistemas.',
                'status' => 'in-progress',
                'progress' => 45,
                'budget' => 120000.00,
                'spent' => 54000.00,
                'start_date' => '2024-01-01',
                'end_date' => '2024-11-30',
                'manager_id' => $adminUser?->id,
                'team_size' => 4,
                'priority' => 'high',
                'tags' => ['seguridad', 'ciberseguridad', 'auditoría'],
                'is_active' => true,
            ]
        ];

        foreach ($projects as $projectData) {
            Project::create(array_merge($projectData, [
                'id' => Str::uuid(),
            ]));
        }
        
        $this->command->info('✅ Proyectos de prueba creados exitosamente');
    }
}
