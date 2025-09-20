<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['planning', 'in-progress', 'completed', 'on-hold'];
        $priorities = ['low', 'medium', 'high'];
        
        return [
            'id' => Str::uuid(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement($statuses),
            'progress' => $this->faker->numberBetween(0, 100),
            'budget' => $this->faker->randomFloat(2, 10000, 500000),
            'spent' => function (array $attributes) {
                return $this->faker->randomFloat(2, 0, $attributes['budget'] * 0.8);
            },
            'start_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'end_date' => $this->faker->dateTimeBetween('now', '+2 years'),
            'manager_id' => null, // Se asignará en el test si es necesario
            'team_size' => $this->faker->numberBetween(1, 15),
            'priority' => $this->faker->randomElement($priorities),
            'tags' => $this->faker->randomElements(['web', 'mobile', 'api', 'database', 'security', 'analytics'], 3),
            'is_active' => $this->faker->boolean(85), // 85% probabilidad de estar activo
        ];
    }
}
