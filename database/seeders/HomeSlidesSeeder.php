<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HomeSlidesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slides = [
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Innovación Tecnológica UBO',
                'subtitle' => 'Transformando la educación superior',
                'description' => 'Descubre las últimas innovaciones tecnológicas que están revolucionando la experiencia educativa en la Universidad Bernardo O\'Higgins.',
                'image_url' => 'https://picsum.photos/800/400?random=1&blur=1',
                'button_text' => 'Conocer más',
                'button_url' => '/servicios',
                'order_index' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Servicios Digitales Avanzados',
                'subtitle' => 'Soluciones integrales para la comunidad UBO',
                'description' => 'Explora nuestra amplia gama de servicios digitales diseñados para mejorar la experiencia de estudiantes, docentes y administrativos.',
                'image_url' => 'https://picsum.photos/800/400?random=2&blur=1',
                'button_text' => 'Ver servicios',
                'button_url' => '/servicios',
                'order_index' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Ciberseguridad Institucional',
                'subtitle' => 'Protegiendo nuestra información',
                'description' => 'Conoce las medidas de ciberseguridad implementadas para proteger la información y sistemas de la universidad.',
                'image_url' => 'https://picsum.photos/800/400?random=3&blur=1',
                'button_text' => 'Más información',
                'button_url' => '/ciberseguridad',
                'order_index' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($slides as $slide) {
            \App\Models\HomeSlide::create($slide);
        }
    }
}
