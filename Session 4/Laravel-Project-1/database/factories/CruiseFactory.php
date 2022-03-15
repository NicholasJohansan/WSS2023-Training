<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cruise>
 */
class CruiseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->colorName(),
            'size' => $this->faker->randomElement(['small', 'medium', 'large']),
            'owner' => $this->faker->name(),
            'capacity' => $this->faker->numberBetween(20, 1000),
            'built_date' => $this->faker->date()
        ];
    }
}
