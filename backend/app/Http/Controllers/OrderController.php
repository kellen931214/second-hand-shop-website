<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()->orders()
            ->with(['orderItems.product'])
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function show($id)
    {
        $user = auth()->user();

        $order = $user->orders()->with(['orderItems.product.reviews' => function($query) use ($user) {
            $query->where('user_id', $user->id);
        }])->findOrFail($id);

        $order->orderItems->each(function($item) {
            $item->is_reviewed = $item->product->reviews->isNotEmpty();
            
            $item->product->makeHidden('reviews');
        });

        return response()->json($order);
    }

    public function destroy($id)
    {
        // 1. 找到該訂單，並預載入訂單項目，避免迴圈內重複查詢 (N+1 問題)
        $order = auth()->user()->orders()->with('orderItems')->findOrFail($id);

        return DB::transaction(function () use ($order) {
            // 2. 遍歷訂單內的所有商品項目
            foreach ($order->orderItems as $item) {
                // 3. 找到對應的商品
                $product = $item->product;

                if ($product) {
                    // 4. 將庫存加回去
                    $product->increment('stock', $item->quantity);
                }
            }

            // 5. 執行刪除訂單
            // 注意：如果你有設定級聯刪除 (onDelete('cascade'))，這會連同 order_items 一起刪掉
            $order->delete();

            return response()->json(['message' => '訂單已刪除，庫存已歸還'], 200);
        });
    }

    public function store(Request $request)
    {
        // 🌟 此處不再需要 validate 'items'，因為我們會直接從資料庫讀取
        try {
            return DB::transaction(function () {
                $user = auth()->user();
                
                // 📖 指令：$user->carts()->get()
                // 用途：從多對多關聯中抓取該使用者購物車內的所有商品。
                $cartItems = $user->carts()->get();

                // 邏輯檢查：如果購物車空空如也，直接拋出異常
                if ($cartItems->isEmpty()) {
                    throw new \Exception("購物車是空的，無法下單。");
                }

                $totalPrice = 0;
                $orderItemsData = [];
                $productIds = [];

                foreach ($cartItems as $item) {
                    // 📖 指令：Product::lockForUpdate()->findOrFail($item->id)
                    // 參數：$item->id 是從購物車抓出的商品主鍵。
                    // 用途：悲觀鎖。確保在計算金額與扣庫存時，沒有其他程序能修改這條商品資料。
                    $product = Product::lockForUpdate()->findOrFail($item->id);
                    
                    // 🌟 參數：$item->pivot->quantity
                    // 用途：從中間表（pivot）取得該商品在購物車裡的數量。
                    $quantity = $item->pivot->quantity;

                    if ($product->stock < $quantity) {
                        throw new \Exception("商品 {$product->name} 庫存不足。");
                    }

                    $subtotal = $product->price * $quantity;
                    $totalPrice += $subtotal;

                    // 📖 指令：decrement('stock', $quantity)
                    // 用途：直接在資料庫執行「庫存 = 庫存 - 數量」，防止程式運算誤差。
                    $product->decrement('stock', $quantity);

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price' => $product->price, 
                    ];

                    $productIds[] = $product->id;
                }

                // 建立訂單主表
                $order = $user->orders()->create([
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                ]);

                // 建立訂單明細
                $order->orderItems()->createMany($orderItemsData);

                // 📖 指令：$user->carts()->detach($productIds)
                // 參數：$productIds 是剛才收集的所有商品 ID 陣列。
                // 用途：清空「已經變成訂單」的購物車內容。
                $user->carts()->detach($productIds);

                return response()->json($order->load('orderItems.product'), 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}