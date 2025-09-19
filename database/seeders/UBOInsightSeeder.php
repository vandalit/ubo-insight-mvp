<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ContentCategory;
use App\Models\Service;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UBOInsightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuarios desde JSON
        $this->seedUsers();
        
        // Crear categorías de contenido
        $this->seedContentCategories();
        
        // Crear servicios desde JSON
        $this->seedServices();
    }

    private function seedUsers(): void
    {
        $usersJson = json_decode(file_get_contents(base_path('frontend/src/assets/data/usuarios.json')), true);
        
        foreach ($usersJson as $userData) {
            User::create([
                'id' => Str::uuid(),
                'name' => $userData['name'],
                'email' => $userData['email'],
                'role' => $userData['role'],
                'permissions' => $userData['permissions'],
                'password' => Hash::make($userData['password']),
                'avatar' => $userData['avatar'] ?? null,
                'last_login' => $userData['lastLogin'] ? now()->parse($userData['lastLogin']) : null,
                'is_active' => $userData['isActive'],
                'created_at' => now()->parse($userData['createdAt']),
            ]);
        }
        
        $this->command->info('✅ Usuarios creados desde JSON');
    }

    private function seedContentCategories(): void
    {
        $categories = [
            [
                'name' => 'Servicios Digitales',
                'slug' => 'servicios-digitales',
                'description' => 'Servicios tecnológicos institucionales',
                'color_hex' => '#0d2c5b',
                'icon' => '🛠️',
            ],
            [
                'name' => 'Ciberseguridad',
                'slug' => 'ciberseguridad',
                'description' => 'Seguridad informática y protección de datos',
                'color_hex' => '#dc3545',
                'icon' => '🛡️',
            ],
            [
                'name' => 'Noticias Institucionales',
                'slug' => 'noticias',
                'description' => 'Comunicados y noticias oficiales',
                'color_hex' => '#28a745',
                'icon' => '📰',
            ],
            [
                'name' => 'Diario Mural',
                'slug' => 'diario-mural',
                'description' => 'Avisos y comunicados internos',
                'color_hex' => '#f39c12',
                'icon' => '📋',
            ],
        ];

        foreach ($categories as $categoryData) {
            ContentCategory::create(array_merge($categoryData, [
                'id' => Str::uuid(),
            ]));
        }
        
        $this->command->info('✅ Categorías de contenido creadas');
    }

    private function seedServices(): void
    {
        $servicesJson = json_decode(file_get_contents(base_path('frontend/src/assets/data/servicios.json')), true);
        $categoryId = ContentCategory::where('slug', 'servicios-digitales')->first()->id;
        
        foreach ($servicesJson as $index => $serviceData) {
            Service::create([
                'id' => Str::uuid(),
                'title' => $serviceData['title'],
                'description' => $serviceData['description'],
                'details' => $serviceData['details'] ?? null,
                'image_url' => $serviceData['image'],
                'category_id' => $categoryId,
                'display_order' => $index + 1,
                'is_active' => true,
            ]);
        }
        
        $this->command->info('✅ Servicios creados desde JSON');
    }
}
