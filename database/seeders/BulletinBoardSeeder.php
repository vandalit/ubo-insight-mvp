<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BulletinBoard;
use App\Models\ContentCategory;
use App\Models\User;
use Illuminate\Support\Str;

class BulletinBoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bulletinJson = json_decode(file_get_contents(base_path('frontend/src/assets/data_backup_json/diario-mural.json')), true);
        $categoryId = ContentCategory::where('slug', 'diario-mural')->first()->id;
        $adminUser = User::where('email', 'uboinsight@ubo.cl')->first();
        
        foreach ($bulletinJson as $bulletinData) {
            BulletinBoard::create([
                'id' => Str::uuid(),
                'title' => $bulletinData['title'],
                'content' => $bulletinData['content'],
                'type' => $bulletinData['type'],
                'category_id' => $categoryId,
                'author_id' => $adminUser?->id,
                'valid_from' => isset($bulletinData['fecha']) ? $bulletinData['fecha'] : now()->toDateString(),
                'valid_until' => isset($bulletinData['fecha']) ? 
                    now()->parse($bulletinData['fecha'])->addDays(30)->toDateString() : 
                    now()->addDays(30)->toDateString(),
                'is_urgent' => $bulletinData['type'] === 'urgente',
                'is_published' => true,
                'views_count' => rand(10, 100),
            ]);
        }
        
        $this->command->info('✅ Diario Mural migrado desde JSON a base de datos');
    }
}
