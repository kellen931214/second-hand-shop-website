<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductView;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->withAvg('reviews', 'rating');
    
        if ($request->filled('key_word')){
            $keyword = $request->input('key_word');
            $query->where('name', 'like', "%{$keyword}%");
        }

        if($request->filled('category_id')){
            $categoryId = $request->input('category_id');
            $query->where('category_id', $categoryId);
        }

        return response()->json($query->paginate(12));

    }

    public function show ($id){
        $product = Product::with(['reviews' => function($query){
            $query ->latest()->take(5);
        }, 'reviews.user' ])->findOrFail($id);
        $product->increment('view_count');

        if (Auth::check()){
            ProductView::updateOrCreate(
                ['user_id' => Auth::id(), 'product_id' => $product->id],
                ['viewed_at' => now()]
            );
        }

        return response()->json($product);
    }

    public function popular()
    {
        $products = Product::withAvg('reviews', 'rating')
            ->orderByDesc('reviews_avg_rating')
            ->take(10)
            ->get();

        return response()->json($products);
    }
    
    public function mostViewed()
    {
        $product = Product::orderByDesc('view_count')
        ->take(10)
        ->get();
        return response()->json($product);
    }

    public function mostWished()
    {
        $products = Product::withCount('wishlistsByUsers')
            ->orderByDesc('wishlists_by_users_count')
            ->take(10)
            ->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
        ]);
        $product = Product::create($validated);
        return response()->json($product,201);   
    }

    public function update(Request $request , $id){
        $product = Product::findOrFail($id);
        $validated = $request -> validate(
            [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'sometimes|required|numeric|min:0',
                'image_url' => 'nullable|url',
                'category_id' => 'sometimes|required|exists:categories,id',
                'stock' => 'sometimes|required|integer|min:0',
            ]);
        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id){
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null,204);
    }
}
