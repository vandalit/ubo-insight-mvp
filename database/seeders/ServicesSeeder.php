<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Biblioteca Digital',
                'description' => 'Acceso completo a recursos bibliográficos digitales, bases de datos académicas y repositorio institucional.',
                'details' => 'La Biblioteca Digital UBO ofrece más de 100,000 recursos digitales incluyendo libros electrónicos, revistas científicas, tesis y trabajos de investigación. Disponible 24/7 para toda la comunidad universitaria.',
                'image_url' => 'https://picsum.photos/400/300?random=1',
                'display_order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Campus Virtual',
                'description' => 'Plataforma educativa online con cursos, materiales y herramientas de aprendizaje interactivo.',
                'details' => 'El Campus Virtual es el corazón del aprendizaje digital en UBO. Incluye aulas virtuales, foros de discusión, evaluaciones online, calendario académico y comunicación directa con profesores.',
                'image_url' => 'https://picsum.photos/400/300?random=2',
                'display_order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Sistema de Gestión Académica',
                'description' => 'Gestión integral de procesos académicos, inscripciones, notas y certificados.',
                'details' => 'Sistema completo para la gestión de tu vida académica: inscripción de asignaturas, consulta de notas, solicitud de certificados, horarios personalizados y seguimiento de avance curricular.',
                'image_url' => 'https://picsum.photos/400/300?random=3',
                'display_order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Conectividad WiFi UBO',
                'description' => 'Red WiFi institucional de alta velocidad disponible en todos los campus y sedes.',
                'details' => 'Red WiFi segura y de alta velocidad disponible para estudiantes, docentes y funcionarios. Cobertura completa en aulas, bibliotecas, laboratorios y espacios comunes. Credenciales de acceso disponibles en Mesa de Ayuda.',
                'image_url' => 'https://picsum.photos/400/300?random=4',
                'display_order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Soporte Técnico',
                'description' => 'Asistencia técnica especializada para equipos, software y servicios digitales institucionales.',
                'details' => 'Servicio de soporte técnico integral que incluye mantenimiento de equipos, instalación de software, resolución de problemas técnicos y capacitación en herramientas digitales para la comunidad universitaria.',
                'image_url' => 'https://picsum.photos/400/300?random=5',
                'display_order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Laboratorios de Computación',
                'description' => 'Espacios equipados con tecnología de vanguardia para el desarrollo académico y profesional.',
                'details' => 'Laboratorios de computación con equipos de última generación, software especializado por carrera, impresoras 3D, y espacios colaborativos. Disponibles para clases, proyectos y uso libre de estudiantes.',
                'image_url' => 'https://picsum.photos/400/300?random=6',
                'display_order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($services as $serviceData) {
            $service = \App\Models\Service::create($serviceData);
            
            // Crear acciones para servicios que las tienen
            if ($service->title === 'Biblioteca Digital') {
                \App\Models\ServiceAction::create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'service_id' => $service->id,
                    'button_text' => 'Acceder',
                    'action_type' => 'login',
                    'action_value' => '/login',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } elseif ($service->title === 'Campus Virtual') {
                \App\Models\ServiceAction::create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'service_id' => $service->id,
                    'button_text' => 'Ingresar',
                    'action_type' => 'login',
                    'action_value' => '/login',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } elseif ($service->title === 'Conectividad WiFi UBO') {
                \App\Models\ServiceAction::create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'service_id' => $service->id,
                    'button_text' => 'Solicitar Acceso',
                    'action_type' => 'mailto',
                    'action_value' => 'mesadeayuda@ubo.cl?subject=Solicitud%20Acceso%20WiFi&body=Solicito%20credenciales%20de%20acceso%20a%20la%20red%20WiFi%20institucional.',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } elseif ($service->title === 'Soporte Técnico') {
                \App\Models\ServiceAction::create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'service_id' => $service->id,
                    'button_text' => 'Solicitar Soporte',
                    'action_type' => 'mailto',
                    'action_value' => 'mesadeayuda@ubo.cl?subject=Solicitud%20Soporte%20Técnico&body=Describa%20su%20problema%20técnico%20o%20solicitud%20de%20soporte.',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
