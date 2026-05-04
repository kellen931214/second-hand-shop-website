<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // 1. 取得某個商品的所有評價
    public function index($productId)
    {
        $product = Product::findOrFail($productId);

        // 撈出評價，順便帶出留言者的名字，最新留言在最前
        $reviews = $product->reviews()
                           ->with('user:id,name') 
                           ->latest()
                           ->paginate(10);

        return response()->json([
            'average_rating' => round($product->reviews()->avg('rating'), 1), // 計算平均星數
            'total_reviews' => $reviews->total(),
            'reviews' => $reviews
        ]);
    }

    public function store(Request $request, $productId)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048' // 最多 2MB
        ]);

        $product = Product::findOrFail($productId);
        $user = auth()->user();

        $hasReviewed = $product->reviews()->where('user_id', $user->id)->exists();
        
        if ($hasReviewed) {
            return response()->json(['message' => '您已經評價過此商品囉'], 400);
        }

        $imagePath = null; 
        
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reviews', 'public');
        }

        $review = $product->reviews()->create([
            'user_id' => $user->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'image_path' => $imagePath 
        ]);

        return response()->json([
            'message' => '評價成功！',
            'data' => $review->load('user:id,name')
        ], 201);
    }

    // 3. 修改評價
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== auth()->id() ) {
            return response()->json(['message' => '您沒有權限修改此評價'], 403);
        }

    
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500'
        ]);

        // 4. 更新資料
        $review->update($validated);

        return response()->json([
            'message' => '評價修改成功',
            'data' => $review->load('user:id,name')
        ], 200);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $user = auth()->user();

        if ($review->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => '您沒有權限刪除此評價'], 403);
        }
        if ($review->image_path){
            Storage::disk('public')->delete($review->image_path);
        }
        $review->delete();

        return response()->json(['message' => '評價已刪除'], 200);
    }
}