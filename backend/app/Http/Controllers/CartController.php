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
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1' // 🌟 1. 允許接收數量
        ]);

        $productId = $validated['product_id'];
        $quantity = $validated['quantity'];

        $product = Product::findOrFail($productId);
        
        if ($product->stock < $quantity) {
            return response()->json(['message' => '商品庫存不足'], 400);
        }

        $user = auth()->user();
        $cartItem = $user->carts()->where('product_id', $productId)->first();

        if (!$cartItem) {
            $user->carts()->attach($productId, ['quantity' => $quantity]);
            $message = '商品已加入購物車';
        } else {
            $newQuantity = $cartItem->pivot->quantity + $quantity;
            
            if ($newQuantity > $product->stock) {
                return response()->json(['message' => '超過商品庫存上限'], 400);
            }

            $user->carts()->updateExistingPivot($productId, ['quantity' => $newQuantity]);
            $message = '已增加購物車內的商品數量';
        }

        return response()->json(['message' => $message, 'product_id' => $productId], 200);
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
        ], 200);
    }

    public function destroy($id)
    {
        auth()->user()->carts()->detach($id);
        return response()->json(['message' => '商品已從購物車移除'], 200);
    }
}