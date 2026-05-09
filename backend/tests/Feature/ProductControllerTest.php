<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_products_with_stock()
    {
        $category = Category::factory()->create();
        Product::factory(3)->create(['category_id' => $category->id, 'stock' => 10]);
        Product::factory()->create(['category_id' => $category->id, 'stock' => 0]);

        $response = $this->getJson('/products');

        $response->assertStatus(200);
        $this->assertEquals(3, count($response->json('data')));
    }

    public function test_index_with_keyword_filter()
    {
        $category = Category::factory()->create();
        Product::factory()->create(['name' => 'iPhone', 'category_id' => $category->id, 'stock' => 10]);
        Product::factory()->create(['name' => 'Samsung', 'category_id' => $category->id, 'stock' => 10]);

        $response = $this->getJson('/products?key_word=iPhone');

        $response->assertStatus(200);
        $this->assertEquals(1, count($response->json('data')));
        $this->assertEquals('iPhone', $response->json('data.0.name'));
    }

    public function test_index_with_category_filter()
    {
        $category1 = Category::factory()->create();
        $category2 = Category::factory()->create();
        Product::factory(2)->create(['category_id' => $category1->id, 'stock' => 10]);
        Product::factory(3)->create(['category_id' => $category2->id, 'stock' => 10]);

        $response = $this->getJson("/products?category_id={$category1->id}");

        $response->assertStatus(200);
        $this->assertEquals(2, count($response->json('data')));
    }

    public function test_show_increments_view_count()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'view_count' => 0]);

        $response = $this->getJson("/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertEquals(1, $product->fresh()->view_count);
    }

    public function test_show_records_viewed_product_for_authenticated_user()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $this->actingAs($user)->getJson("/products/{$product->id}");

        $this->assertTrue($user->viewedProducts()->where('product_id', $product->id)->exists());
    }

    public function test_show_returns_reviews_with_user()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $reviews = Review::factory(6)->create(['product_id' => $product->id]);

        $response = $this->getJson("/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('reviews'));
    }

    public function test_popular_returns_products_by_rating()
    {
        $category = Category::factory()->create();
        $product1 = Product::factory()->create(['category_id' => $category->id]);
        $product2 = Product::factory()->create(['category_id' => $category->id]);
        Review::factory(5)->create(['product_id' => $product1->id, 'rating' => 5]);
        Review::factory(5)->create(['product_id' => $product2->id, 'rating' => 2]);

        $response = $this->getJson('/products/popular');

        $response->assertStatus(200);
        $this->assertEquals($product1->id, $response->json('0.id'));
    }

    public function test_most_viewed_returns_top_products()
    {
        $category = Category::factory()->create();
        $product1 = Product::factory()->create(['category_id' => $category->id, 'view_count' => 100]);
        $product2 = Product::factory()->create(['category_id' => $category->id, 'view_count' => 50]);

        $response = $this->getJson('/products/most-viewed');

        $response->assertStatus(200);
        $this->assertEquals($product1->id, $response->json('0.id'));
    }

    public function test_most_wished_returns_top_products()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $category = Category::factory()->create();
        $product1 = Product::factory()->create(['category_id' => $category->id]);
        $product2 = Product::factory()->create(['category_id' => $category->id]);

        $user1->wishlists()->attach([$product1->id, $product2->id]);
        $user2->wishlists()->attach($product1->id);

        $response = $this->getJson('/products/most-wished');

        $response->assertStatus(200);
        $this->assertEquals($product1->id, $response->json('0.id'));
    }

    public function test_store_creates_product()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();
        $data = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100,
            'image_url' => 'https://example.com/image.jpg',
            'category_id' => $category->id,
            'stock' => 10,
        ];

        $response = $this->actingAs($admin)->postJson('/products', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', ['name' => 'Test Product']);
    }

    public function test_store_validates_required_fields()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->postJson('/products', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'price', 'category_id', 'stock']);
    }

    public function test_update_modifies_product()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'name' => 'Old Name']);

        $response = $this->actingAs($admin)->putJson("/products/{$product->id}", ['name' => 'New Name']);

        $response->assertStatus(200);
        $this->assertEquals('New Name', $product->fresh()->name);
    }
}
