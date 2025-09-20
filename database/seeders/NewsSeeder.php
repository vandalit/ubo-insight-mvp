<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\ContentCategory;
use App\Models\User;
use App\Models\Tag;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear noticias de ejemplo para el departamento TI
        $newsData = [
            [
                'title' => 'Actualización del Sistema de Gestión Académica',
                'content' => 'Se ha completado la actualización del sistema de gestión académica con nuevas funcionalidades que mejoran la experiencia de usuarios y optimizan los procesos administrativos. Las mejoras incluyen un nuevo dashboard para estudiantes, reportes automatizados para docentes y herramientas de análisis para coordinadores académicos.',
                'excerpt' => 'Nueva actualización del sistema académico con mejoras significativas en funcionalidad y experiencia de usuario.',
                'image_url' => 'https://picsum.photos/600/400?random=21',
                'tags' => ['tecnologia', 'servicios'],
                'is_featured' => true,
            ],
            [
                'title' => 'Implementación de Nuevas Medidas de Ciberseguridad',
                'content' => 'El departamento de TI ha implementado nuevas medidas de seguridad incluyendo autenticación de dos factores, monitoreo avanzado de amenazas y capacitaciones obligatorias para todo el personal. Estas medidas fortalecen la protección de datos institucionales y personales.',
                'excerpt' => 'Nuevas medidas de ciberseguridad implementadas para fortalecer la protección institucional.',
                'image_url' => 'https://picsum.photos/600/400?random=22',
                'tags' => ['seguridad', 'tecnologia'],
                'is_featured' => false,
            ],
            [
                'title' => 'Mantenimiento Programado de Servidores',
                'content' => 'Se realizará mantenimiento programado de los servidores principales el próximo sábado de 02:00 a 06:00 hrs. Durante este período algunos servicios podrían experimentar interrupciones menores. Se recomienda guardar el trabajo frecuentemente.',
                'excerpt' => 'Mantenimiento programado de servidores este sábado en horario de madrugada.',
                'image_url' => 'https://picsum.photos/600/400?random=23',
                'tags' => ['mantenimiento', 'servicios'],
                'is_featured' => false,
            ],
            [
                'title' => 'Lanzamiento del Nuevo Portal de Innovación',
                'content' => 'Presentamos el nuevo portal de innovación que conecta a estudiantes, docentes e investigadores con oportunidades de desarrollo tecnológico. La plataforma incluye un sistema de gestión de proyectos, repositorio de recursos y herramientas de colaboración.',
                'excerpt' => 'Nuevo portal de innovación para conectar la comunidad universitaria con proyectos tecnológicos.',
                'image_url' => 'https://picsum.photos/600/400?random=24',
                'tags' => ['innovacion', 'educacion'],
                'is_featured' => false,
            ],
            [
                'title' => 'Capacitación en Herramientas Digitales para Docentes',
                'content' => 'El programa de capacitación en herramientas digitales para docentes ha alcanzado un 95% de participación. Las sesiones incluyen uso de plataformas LMS, creación de contenido multimedia y técnicas de evaluación online.',
                'excerpt' => 'Programa de capacitación digital para docentes alcanza alta participación.',
                'image_url' => 'https://picsum.photos/600/400?random=25',
                'tags' => ['educacion', 'tecnologia'],
                'is_featured' => false,
            ]
        ];

        $categoryId = ContentCategory::where('slug', 'noticias-institucionales')->first()?->id;
        $adminUser = User::first(); // Usar el primer usuario disponible
        
        foreach ($newsData as $index => $data) {
            $news = News::create([
                'id' => Str::uuid(),
                'title' => $data['title'],
                'content' => $data['content'],
                'excerpt' => $data['excerpt'],
                'image_url' => $data['image_url'],
                'category_id' => $categoryId,
                'author_id' => $adminUser?->id,
                'is_featured' => $data['is_featured'],
                'is_published' => true,
                'published_at' => now()->subDays(rand(1, 15)),
                'views_count' => rand(50, 500),
            ]);

            // Asignar tags
            foreach ($data['tags'] as $tagSlug) {
                $tag = Tag::where('slug', $tagSlug)->first();
                if ($tag) {
                    $news->tags()->attach($tag->id, [
                        'id' => Str::uuid(),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }
        
        $this->command->info('✅ Noticias migradas con tags a base de datos');
    }
}
