<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HistoryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_viewed_products()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $products = Product::factory(15)->create(['category_id' => $category->id]);

        $user->viewedProducts()->attach($products->pluck('id')->toArray());

        $response = $this->actingAs($user)->getJson('/history');

        $response->assertStatus(200);
        $this->assertCount(12, $response->json('data'));
    }

    public function test_destroy_removes_product_from_history()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $user->viewedProducts()->attach($product->id);

        $response = $this->actingAs($user)->deleteJson("/history/{$product->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('message', '已從瀏覽紀錄中移除');
        $this->assertFalse($user->viewedProducts()->where('product_id', $product->id)->exists());
    }

    public function test_clear_all_removes_all_history()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $products = Product::factory(5)->create(['category_id' => $category->id]);

        $user->viewedProducts()->attach($products->pluck('id')->toArray());

        $response = $this->actingAs($user)->deleteJson('/history');

        $response->assertStatus(200);
        $response->assertJsonPath('message', '瀏覽紀錄已全部清空');
        $this->assertCount(0, $user->viewedProducts);
    }
}
