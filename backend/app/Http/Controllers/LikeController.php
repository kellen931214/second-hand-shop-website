<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request){
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $result = auth()->user()->likes()->toggle($validated['product_id']);

        $isAdded = count($result['attached']) > 0;

        return response()->json([
            'status' => 'success',
            'action' => $isAdded ? 'added' : 'removed',
            'message' => $isAdded ? '已加入喜歡' : '已從喜歡移除'
        ]);
    }
}
