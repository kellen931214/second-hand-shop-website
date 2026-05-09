<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_cart_items()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $user->carts()->attach($product->id, ['quantity' => 2]);

        $response = $this->actingAs($user)->getJson('/carts');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_store_adds_product_to_cart()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'stock' => 10]);

        $response = $this->actingAs($user)->postJson('/carts', [
            'product_id' => $product->id
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('message', '商品已加入購物車');
        $this->assertTrue($user->carts()->where('product_id', $product->id)->exists());
    }

    public function test_store_returns_200_if_product_already_in_cart()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'stock' => 10]);
        $user->carts()->attach($product->id, ['quantity' => 1]);

        $response = $this->actingAs($user)->postJson('/carts', [
            'product_id' => $product->id
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('message', '商品已在購物車中');
    }

    public function test_store_returns_400_if_stock_insufficient()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'stock' => 0]);

        $response = $this->actingAs($user)->postJson('/carts', [
            'product_id' => $product->id
        ]);

        $response->assertStatus(400);
        $response->assertJsonPath('message', '商品庫存不足');
    }

    public function test_update_changes_quantity()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'stock' => 10]);
        $user->carts()->attach($product->id, ['quantity' => 1]);

        $response = $this->actingAs($user)->patchJson("/carts/{$product->id}", [
            'quantity' => 5
        ]);

        $response->assertStatus(200);
        $this->assertEquals(5, $user->carts()->where('product_id', $product->id)->first()->pivot->quantity);
    }

    public function test_update_returns_400_if_quantity_exceeds_stock()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'stock' => 5]);
        $user->carts()->attach($product->id, ['quantity' => 1]);

        $response = $this->actingAs($user)->patchJson("/carts/{$product->id}", [
            'quantity' => 10
        ]);

        $response->assertStatus(400);
        $response->assertJsonPath('message', '商品庫存不足');
    }

    public function test_destroy_removes_product_from_cart()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $user->carts()->attach($product->id, ['quantity' => 1]);

        $response = $this->actingAs($user)->deleteJson("/carts/{$product->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('message', '商品已從購物車移除');
        $this->assertFalse($user->carts()->where('product_id', $product->id)->exists());
    }
}
