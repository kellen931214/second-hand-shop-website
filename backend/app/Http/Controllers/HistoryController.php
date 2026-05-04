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