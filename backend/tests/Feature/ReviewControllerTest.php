<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_product_reviews()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $reviews = Review::factory(12)->create(['product_id' => $product->id]);

        $response = $this->getJson("/products/{$product->id}/reviews");

        $response->assertStatus(200);
        $this->assertCount(10, $response->json('reviews.data'));
        $this->assertArrayHasKey('average_rating', $response->json());
        $this->assertArrayHasKey('total_reviews', $response->json());
    }

    public function test_store_creates_review()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
            'rating' => 5,
            'comment' => 'Great product!'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reviews', [
            'product_id' => $product->id,
            'user_id' => $user->id,
            'rating' => 5,
            'comment' => 'Great product!'
        ]);
    }

    public function test_store_returns_400_if_user_already_reviewed()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        Review::factory()->create(['product_id' => $product->id, 'user_id' => $user->id]);

        $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
            'rating' => 5,
            'comment' => 'Another review'
        ]);

        $response->assertStatus(400);
        $response->assertJsonPath('message', '您已經評價過此商品囉');
    }

    public function test_store_validates_rating()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
            'rating' => 10,
            'comment' => 'Invalid rating'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('rating');
    }

    public function test_update_modifies_review()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $review = Review::factory()->create(['product_id' => $product->id, 'user_id' => $user->id, 'rating' => 3]);

        $response = $this->actingAs($user)->putJson("/reviews/{$review->id}", [
            'rating' => 5,
            'comment' => 'Updated comment'
        ]);

        $response->assertStatus(200);
        $this->assertEquals(5, $review->fresh()->rating);
    }

    public function test_update_returns_403_if_not_owner()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $review = Review::factory()->create(['product_id' => $product->id, 'user_id' => $user1->id]);

        $response = $this->actingAs($user2)->putJson("/reviews/{$review->id}", [
            'rating' => 5
        ]);

        $response->assertStatus(403);
    }

    public function test_destroy_deletes_review()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $review = Review::factory()->create(['product_id' => $product->id, 'user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/reviews/{$review->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_destroy_returns_403_if_not_owner_or_admin()
    {
        $user1 = User::factory()->create(['role' => 'user']);
        $user2 = User::factory()->create(['role' => 'user']);
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $review = Review::factory()->create(['product_id' => $product->id, 'user_id' => $user1->id]);

        $response = $this->actingAs($user2)->deleteJson("/reviews/{$review->id}");

        $response->assertStatus(403);
    }

    public function test_destroy_allows_admin_to_delete()
    {
        $user = User::factory()->create(['role' => 'user']);
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $review = Review::factory()->create(['product_id' => $product->id, 'user_id' => $user->id]);

        $response = $this->actingAs($admin)->deleteJson("/reviews/{$review->id}");

        $response->assertStatus(200);
    }
}
