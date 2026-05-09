<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'total_price' => fake()->numberBetween(100, 50000),
            'status' => fake()->randomElement(['pending', 'completed', 'cancelled']),
            'meetup_location' => fake()->address(),
        ];
    }
}
