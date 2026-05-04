<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
// use App\Models\OrderItem; // 如果 store 裡是用關聯建立，這行通常可以不用引進來
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

            return response()->json(['message' => '訂單已刪除，庫存已歸還']);
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
                }

                // 建立訂單主表
                $order = $user->orders()->create([
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                ]);

                // 建立訂單明細
                $order->orderItems()->createMany($orderItemsData);

                return response()->json($order->load('orderItems.product'), 201);
            });
        } catch (\Exception $e) {
            // 捕捉剛才拋出的庫存不足或其他錯誤，回傳給前端
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}