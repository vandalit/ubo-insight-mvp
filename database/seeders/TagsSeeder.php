<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Tecnología',
                'slug' => 'tecnologia',
                'description' => 'Noticias relacionadas con tecnología e innovación',
                'color_hex' => '#0d2c5b',
                'icon' => '💻',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Educación',
                'slug' => 'educacion',
                'description' => 'Noticias sobre educación y academia',
                'color_hex' => '#27ae60',
                'icon' => '📚',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Seguridad',
                'slug' => 'seguridad',
                'description' => 'Noticias sobre ciberseguridad y protección',
                'color_hex' => '#e74c3c',
                'icon' => '🔒',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Innovación',
                'slug' => 'innovacion',
                'description' => 'Proyectos innovadores y desarrollo',
                'color_hex' => '#f39c12',
                'icon' => '💡',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Servicios',
                'slug' => 'servicios',
                'description' => 'Actualizaciones de servicios institucionales',
                'color_hex' => '#9b59b6',
                'icon' => '⚙️',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Mantenimiento',
                'slug' => 'mantenimiento',
                'description' => 'Avisos de mantenimiento y actualizaciones',
                'color_hex' => '#34495e',
                'icon' => '🔧',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($tags as $tag) {
            \App\Models\Tag::create($tag);
        }
    }
}
