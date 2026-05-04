<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class HistoryController extends Controller
{

    public function index()
    {
        $history = auth()->user()->viewedProducts()
                         ->orderByPivot('updated_at', 'desc')
                         ->paginate(12);

        return response()->json($history);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $user = auth()->user();
        $productId = $validated['product_id'];

        $hasViewed = $user->viewedProducts()->where('product_id', $productId)->exists();

        if ($hasViewed) {
            $user->viewedProducts()->updateExistingPivot($productId, ['updated_at' => now()]);
        } else {
            $user->viewedProducts()->attach($productId);
        }

        return response()->json(['message' => '瀏覽紀錄已更新'], 200);
    }


    public function destroy($productId)
    {
        auth()->user()->viewedProducts()->detach($productId);

        return response()->json(['message' => '已從瀏覽紀錄中移除'], 200);
    }
    

    public function clearAll()
    {
        auth()->user()->viewedProducts()->detach();

        return response()->json(['message' => '瀏覽紀錄已全部清空'], 200);
    }
}