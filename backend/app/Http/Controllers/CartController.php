<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = auth()->user()->carts()->latest()->paginate(10);
        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $product = Product::findOrFail($validated['product_id']);
        if ($product->stock < 1){
            return response()->json(['message' => '商品庫存不足'], 400);
        }

        $user = auth()->user();
        $productId = $validated['product_id']; 
        
        $isExists = $user->carts()->where('product_id', $productId)->exists();
        
        if (!$isExists) {
            $user->carts()->attach($productId, ['quantity' => 1]);
            $message = '商品已加入購物車';
            $status = 201; 
        } else {
            $message = '商品已在購物車中';
            $status = 200;
        }

        return response()->json([
            'message' => $message,
            'product_id' => $productId
        ], $status); 
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($id);
        if ($validated['quantity'] > $product->stock){
            return response()->json(['message' => '商品庫存不足'], 400);
        }
        
        auth()->user()->carts()->updateExistingPivot($id, ['quantity' => $validated['quantity']]);
        
        return response()->json([
            'message' => '購物車已更新',
            'quantity' => $validated['quantity'],
            'product_id' => $id
        ]);
    }

    public function destroy($id)
    {
        auth()->user()->carts()->detach($id);
        return response()->json(['message' => '商品已從購物車移除']);
    }
}