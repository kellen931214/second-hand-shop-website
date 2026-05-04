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
        $order = auth()->user()->orders()
            ->with(['orderItems.product'])
            ->findOrFail($id); 

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
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = auth()->user();
                $totalPrice = 0;
                $orderItemsData = [];
                $productIds = []; // 【新增】準備一個空陣列，用來收集這次購買的商品 ID

                foreach ($request->items as $item) {
                    // lockForUpdate 會鎖定這行資料，直到 Transaction 結束
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    if ($product->stock < $item['quantity']) {
                        // 這裡拋出 Exception 會觸發 Transaction 回滾
                        throw new \Exception("商品 {$product->name} 庫存不足。");
                    }

                    $subtotal = $product->price * $item['quantity'];
                    $totalPrice += $subtotal;

                    // 執行庫存扣除
                    $product->decrement('stock', $item['quantity']);

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price, 
                    ];

                    // 【新增】將當前商品的 ID 存入收集陣列中
                    $productIds[] = $product->id;
                }

                // 建立訂單主表
                $order = $user->orders()->create([
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                ]);

                // 建立訂單明細
                $order->orderItems()->createMany($orderItemsData);

                // 【新增】將已經結帳的商品，從使用者的購物車中移除
                $user->carts()->detach($productIds);

                return response()->json($order->load('orderItems.product'), 201);
            });
        } catch (\Exception $e) {
            // 捕捉剛才拋出的庫存不足或其他錯誤，回傳給前端
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}