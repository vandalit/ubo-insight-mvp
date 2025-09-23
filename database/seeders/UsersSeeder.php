<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador por defecto
        User::create([
            'id' => Str::uuid(),
            'name' => 'Administrador UBO Insight',
            'email' => 'admin@ubo.cl',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'permissions' => ['ciberseguridad', 'proyectos', 'cms', 'datos', 'admin_access', 'user_management'],
            'avatar' => 'https://ui-avatars.com/api/?name=Admin+UBO&background=0d2c5b&color=fff&size=128',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear usuario jefe de proyectos
        User::create([
            'id' => Str::uuid(),
            'name' => 'María Rodríguez',
            'email' => 'maria.rodriguez@ubo.cl',
            'email_verified_at' => now(),
            'password' => Hash::make('demo123'),
            'role' => 'project_manager',
            'permissions' => ['proyectos', 'cms', 'datos', 'team_management', 'project_creation'],
            'avatar' => 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=2563eb&color=fff&size=128',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear usuario desarrollador
        User::create([
            'id' => Str::uuid(),
            'name' => 'Juan Silva',
            'email' => 'juan.silva@ubo.cl',
            'email_verified_at' => now(),
            'password' => Hash::make('demo123'),
            'role' => 'developer',
            'permissions' => ['cms', 'datos', 'vuln_access', 'technical_tools'],
            'avatar' => 'https://ui-avatars.com/api/?name=Juan+Silva&background=059669&color=fff&size=128',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear analista de seguridad
        User::create([
            'id' => Str::uuid(),
            'name' => 'Ana Torres',
            'email' => 'ana.torres@ubo.cl',
            'email_verified_at' => now(),
            'password' => Hash::make('demo123'),
            'role' => 'security_analyst',
            'permissions' => ['ciberseguridad', 'datos', 'soc_access', 'vuln_access', 'incident_access'],
            'avatar' => 'https://ui-avatars.com/api/?name=Ana+Torres&background=dc2626&color=fff&size=128',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear stakeholder
        User::create([
            'id' => Str::uuid(),
            'name' => 'Carlos Méndez',
            'email' => 'carlos.mendez@ubo.cl',
            'email_verified_at' => now(),
            'password' => Hash::make('demo123'),
            'role' => 'stakeholder',
            'permissions' => ['proyectos_readonly', 'compliance_access', 'basic_metrics'],
            'avatar' => 'https://ui-avatars.com/api/?name=Carlos+Mendez&background=f39c12&color=fff&size=128',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('✅ Usuarios creados: 5 usuarios con roles diferenciados');
        $this->command->info('📧 Admin: admin@ubo.cl / admin123');
        $this->command->info('📧 Project Manager: maria.rodriguez@ubo.cl / demo123');
        $this->command->info('📧 Developer: juan.silva@ubo.cl / demo123');
        $this->command->info('📧 Security Analyst: ana.torres@ubo.cl / demo123');
        $this->command->info('📧 Stakeholder: carlos.mendez@ubo.cl / demo123');
    }
}
