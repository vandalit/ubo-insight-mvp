<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CybersecurityItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Políticas de Seguridad',
                'description' => 'Marco normativo y políticas institucionales para la protección de información y sistemas.',
                'details' => 'Conjunto completo de políticas y procedimientos de seguridad que rigen el uso de tecnologías de información en UBO. Incluye normativas de acceso, uso aceptable, clasificación de información y respuesta a incidentes.',
                'image_url' => 'https://picsum.photos/400/300?random=11',
                'item_type' => 'policy',
                'display_order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Capacitación en Ciberseguridad',
                'description' => 'Programas de formación y concientización en seguridad informática para la comunidad universitaria.',
                'details' => 'Cursos y talleres especializados en ciberseguridad dirigidos a estudiantes, docentes y personal administrativo. Incluye simulacros de phishing, buenas prácticas y certificaciones en seguridad.',
                'image_url' => 'https://picsum.photos/400/300?random=12',
                'item_type' => 'training',
                'display_order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Centro de Respuesta a Incidentes',
                'description' => 'CERT-UBO: Equipo especializado en detección, análisis y respuesta a incidentes de seguridad.',
                'details' => 'Centro de Respuesta a Emergencias Informáticas de UBO (CERT-UBO) que monitorea, detecta y responde a amenazas cibernéticas. Disponible 24/7 para atender incidentes de seguridad.',
                'image_url' => 'https://picsum.photos/400/300?random=13',
                'item_type' => 'incident',
                'display_order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Auditorías de Seguridad',
                'description' => 'Evaluaciones periódicas de vulnerabilidades y cumplimiento de estándares de seguridad.',
                'details' => 'Programa integral de auditorías de seguridad que incluye evaluaciones de vulnerabilidades, pruebas de penetración, revisión de configuraciones y verificación del cumplimiento normativo.',
                'image_url' => 'https://picsum.photos/400/300?random=14',
                'item_type' => 'audit',
                'display_order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Gestión de Identidades',
                'description' => 'Sistema centralizado de autenticación y autorización para acceso a recursos institucionales.',
                'details' => 'Plataforma de gestión de identidades y accesos (IAM) que centraliza la autenticación, autorización y administración de usuarios para todos los sistemas institucionales con Single Sign-On (SSO).',
                'image_url' => 'https://picsum.photos/400/300?random=15',
                'item_type' => 'identity',
                'display_order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($items as $item) {
            \App\Models\CybersecurityItem::create($item);
        }
    }
}
