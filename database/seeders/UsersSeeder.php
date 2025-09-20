<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador por defecto
        \App\Models\User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Administrador TI',
            'email' => 'admin@ubo.cl',
            'email_verified_at' => now(),
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear usuario jefe de proyectos
        \App\Models\User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Jefe de Proyectos TI',
            'email' => 'proyectos@ubo.cl',
            'email_verified_at' => now(),
            'password' => \Illuminate\Support\Facades\Hash::make('proyectos123'),
            'role' => 'project_manager',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear usuario desarrollador
        \App\Models\User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Desarrollador Senior',
            'email' => 'dev@ubo.cl',
            'email_verified_at' => now(),
            'password' => \Illuminate\Support\Facades\Hash::make('dev123'),
            'role' => 'developer',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('✅ Usuarios creados: admin@ubo.cl, proyectos@ubo.cl, dev@ubo.cl');
    }
}
