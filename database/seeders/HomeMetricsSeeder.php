<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HomeMetricsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $metrics = [
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Tickets Ingresados',
                'subtitle' => 'Este mes',
                'value' => 1247,
                'unit' => 'tickets',
                'icon' => '📥',
                'color' => '#0d2c5b',
                'order_index' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'En Atención',
                'subtitle' => 'Actualmente',
                'value' => 89,
                'unit' => 'casos',
                'icon' => '⚙️',
                'color' => '#f39c12',
                'order_index' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'title' => 'Resueltos',
                'subtitle' => 'Este mes',
                'value' => 1158,
                'unit' => 'tickets',
                'icon' => '✅',
                'color' => '#27ae60',
                'order_index' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($metrics as $metric) {
            \App\Models\HomeMetric::create($metric);
        }
    }
}
