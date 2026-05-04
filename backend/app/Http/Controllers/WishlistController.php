<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Wishlist;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlists = auth()->user()->wishlists()
        ->with('product')
        ->latest()
        ->paginate(10);
        return response()->json($wishlists);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $result = auth()->user()->wishlists()->toggle($validated['product_id']);

        $isAdded = count($result['attached']) > 0;

        return response()->json([
            'status' => 'success',
            'action' => $isAdded ? 'added' : 'removed',
            'message' => $isAdded ? '已加入收藏' : '已從收藏移除'
        ]);
    }
}
