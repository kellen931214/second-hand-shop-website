<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_user_orders()
    {
        $user = User::factory()->create();
        Order::factory(3)->create(['user_id' => $user->id]);
        Order::factory()->create(['user_id' => User::factory()->create()->id]);

        $response = $this->actingAs($user)->getJson('/orders');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_show_returns_order_with_items()
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson("/orders/{$order->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('id', $order->id);
    }

    public function test_show_returns_404_for_other_user_order()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)->getJson("/orders/{$order->id}");

        $response->assertStatus(404);
    }

    public function test_store_creates_order_and_deducts_stock()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product1 = Product::factory()->create(['category_id' => $category->id, 'stock' => 10, 'price' => 100]);
        $product2 = Product::factory()->create(['category_id' => $category->id, 'stock' => 20, 'price' => 50]);

        $response = $this->actingAs($user)->postJson('/orders', [
            'items' => [
                ['product_id' => $product1->id, 'quantity' => 2],
                ['product_id' => $product2->id, 'quantity' => 3],
            ]
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'total_price' => 350]);
        $this->assertEquals(8, $product1->fresh()->stock);
        $this->assertEquals(17, $product2->fresh()->stock);
    }

    public function test_store_removes_items_from_cart()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product1 = Product::factory()->create(['category_id' => $category->id, 'stock' => 10, 'price' => 100]);
        $product2 = Product::factory()->create(['category_id' => $category->id, 'stock' => 20, 'price' => 50]);
        
        $user->carts()->attach([$product1->id => ['quantity' => 2], $product2->id => ['quantity' => 3]]);

        $response = $this->actingAs($user)->postJson('/orders', [
            'items' => [
                ['product_id' => $product1->id, 'quantity' => 2],
                ['product_id' => $product2->id, 'quantity' => 3],
            ]
        ]);

        $response->assertStatus(201);
        $this->assertFalse($user->carts()->where('product_id', $product1->id)->exists());
        $this->assertFalse($user->carts()->where('product_id', $product2->id)->exists());
    }

    public function test_store_returns_400_if_stock_insufficient()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'stock' => 5, 'price' => 100]);

        $response = $this->actingAs($user)->postJson('/orders', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 10],
            ]
        ]);

        $response->assertStatus(400);
        $response->assertJsonPath('message', fn ($msg) => str_contains($msg, '庫存不足'));
    }

    public function test_destroy_restores_stock()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'stock' => 5, 'price' => 100]);
        
        $order = Order::factory()->create(['user_id' => $user->id]);
        $order->orderItems()->create(['product_id' => $product->id, 'quantity' => 3, 'price' => 100]);

        $response = $this->actingAs($user)->deleteJson("/orders/{$order->id}");

        $response->assertStatus(200);
        $this->assertEquals(8, $product->fresh()->stock);
    }

    public function test_destroy_returns_404_for_other_user_order()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)->deleteJson("/orders/{$order->id}");

        $response->assertStatus(404);
    }
}
