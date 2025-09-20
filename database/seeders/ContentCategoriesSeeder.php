<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContentCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Servicios Digitales',
                'slug' => 'servicios-digitales',
                'description' => 'Servicios tecnológicos y digitales de la universidad',
                'color_hex' => '#0d2c5b',
                'icon' => '💻',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Noticias Institucionales',
                'slug' => 'noticias-institucionales',
                'description' => 'Noticias y comunicados oficiales de la universidad',
                'color_hex' => '#f39c12',
                'icon' => '📰',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Ciberseguridad',
                'slug' => 'ciberseguridad',
                'description' => 'Políticas y procedimientos de seguridad informática',
                'color_hex' => '#e74c3c',
                'icon' => '🔒',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Avisos Generales',
                'slug' => 'avisos-generales',
                'description' => 'Avisos y comunicaciones del diario mural',
                'color_hex' => '#27ae60',
                'icon' => '📋',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($categories as $category) {
            \App\Models\ContentCategory::create($category);
        }
    }
}
