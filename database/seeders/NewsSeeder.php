<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\ContentCategory;
use App\Models\User;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $newsJson = json_decode(file_get_contents(base_path('frontend/src/assets/data_backup_json/noticias.json')), true);
        $categoryId = ContentCategory::where('slug', 'noticias')->first()->id;
        $adminUser = User::where('email', 'uboinsight@ubo.cl')->first();
        
        foreach ($newsJson as $index => $newsData) {
            News::create([
                'id' => Str::uuid(),
                'title' => $newsData['title'],
                'content' => $newsData['content'],
                'excerpt' => $newsData['excerpt'] ?? substr($newsData['content'], 0, 200) . '...',
                'image_url' => $newsData['image'],
                'category_id' => $categoryId,
                'author_id' => $adminUser?->id,
                'is_featured' => $index === 0, // Primera noticia como destacada
                'is_published' => true,
                'published_at' => now()->subDays(rand(1, 30)),
                'views_count' => rand(50, 500),
            ]);
        }
        
        $this->command->info('✅ Noticias migradas desde JSON a base de datos');
    }
}
