<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LikeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_toggle_adds_like_to_review()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $review = Review::factory()->create(['product_id' => $product->id]);

        $response = $this->actingAs($user)->postJson("/reviews/{$review->id}/like");

        $response->assertStatus(200);
        $response->assertJsonPath('action', 'added');
        $response->assertJsonPath('message', '已點讚');
        $this->assertTrue($user->likedReviews()->where('review_id', $review->id)->exists());
    }

    public function test_toggle_removes_like_from_review()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $review = Review::factory()->create(['product_id' => $product->id]);

        $user->likedReviews()->attach($review->id);

        $response = $this->actingAs($user)->postJson("/reviews/{$review->id}/like");

        $response->assertStatus(200);
        $response->assertJsonPath('action', 'removed');
        $response->assertJsonPath('message', '已取消點讚');
        $this->assertFalse($user->likedReviews()->where('review_id', $review->id)->exists());
    }

    public function test_toggle_returns_correct_like_count()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        $review = Review::factory()->create(['product_id' => $product->id]);

        $user2->likedReviews()->attach($review->id);
        $user3->likedReviews()->attach($review->id);

        $response = $this->actingAs($user1)->postJson("/reviews/{$review->id}/like");

        $response->assertStatus(200);
        $response->assertJsonPath('like_count', 3);
    }
}
