<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ContentCategoriesSeeder::class,
            UsersSeeder::class,
            TagsSeeder::class,
            ProjectsSeeder::class,
            ServicesSeeder::class,
            CybersecurityItemsSeeder::class,
            NewsSeeder::class,
            BulletinBoardSeeder::class,
            HomeSlidesSeeder::class,
            HomeMetricsSeeder::class,
        ]);
    }
}
