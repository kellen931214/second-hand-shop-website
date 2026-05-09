<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WishlistControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_user_wishlists()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $products = Product::factory(5)->create(['category_id' => $category->id]);

        $user->wishlists()->attach($products->pluck('id')->toArray());

        $response = $this->actingAs($user)->getJson('/wishlists');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('data'));
    }

    public function test_toggle_adds_product_to_wishlist()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $this->withoutExceptionHandling();
        $response = $this->actingAs($user)->postJson('/wishlists/toggle', [
            'product_id' => $product->id
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('action', 'added');
        $response->assertJsonPath('message', '已加入收藏');
        $this->assertTrue($user->wishlists()->where('product_id', $product->id)->exists());
    }

    public function test_toggle_removes_product_from_wishlist()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $user->wishlists()->attach($product->id);

        $response = $this->actingAs($user)->postJson('/wishlists/toggle', [
            'product_id' => $product->id
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('action', 'removed');
        $response->assertJsonPath('message', '已從收藏移除');
        $this->assertFalse($user->wishlists()->where('product_id', $product->id)->exists());
    }
}
