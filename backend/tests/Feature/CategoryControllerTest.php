<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_categories_with_product_count()
    {
        $category = Category::factory()->create();
        Product::factory(3)->create(['category_id' => $category->id, 'stock' => 10]);
        Product::factory()->create(['category_id' => $category->id, 'stock' => 0]);

        $response = $this->getJson('/categories');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonPath('0.id', $category->id);
        $response->assertJsonPath('0.products_count', 3);
    }

    public function test_show_returns_category_with_products()
    {
        $category = Category::factory()->create();
        $products = Product::factory(15)->create(['category_id' => $category->id, 'stock' => 10]);
        Product::factory(5)->create(['category_id' => $category->id, 'stock' => 0]);

        $response = $this->getJson("/categories/{$category->id}/products");

        $response->assertStatus(200);
        $response->assertJsonPath('category.id', $category->id);
        $response->assertJsonPath('products.data', function ($data) {
            return count($data) <= 12;
        });
    }

    public function test_show_returns_404_for_nonexistent_category()
    {
        $response = $this->getJson('/categories/999/products');

        $response->assertStatus(404);
    }

    public function test_show_only_returns_products_with_stock()
    {
        $category = Category::factory()->create();
        Product::factory(3)->create(['category_id' => $category->id, 'stock' => 10]);
        Product::factory(2)->create(['category_id' => $category->id, 'stock' => 0]);

        $response = $this->getJson("/categories/{$category->id}/products");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('products.data'));
    }
}
