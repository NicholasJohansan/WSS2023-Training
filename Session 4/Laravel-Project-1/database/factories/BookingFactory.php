<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Account;
use App\Models\Cruise;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'account_id' => Account::where('type', 'customer')->inRandomOrder()->first()->id,
            'cruise_id' => Cruise::inRandomOrder()->first()->id,
            'price' => $this->faker->randomFloat(2, 5, 1000),
            'quantity' => $this->faker->randomDigitNotNull(),
            'sailing_datetime' => $this->faker->dateTime(),
            'booking_datetime' => $this->faker->dateTime()
        ];
    }
}
