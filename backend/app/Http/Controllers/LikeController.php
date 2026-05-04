<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, $id){
        $review = \App\Models\Review::findOrFail($id);
        $result = auth()->user()->likedReviews()->toggle($id);

        $isAdded = count($result['attached']) > 0;

        return response()->json([
            'status' => 'success',
            'action' => $isAdded ? 'added' : 'removed',
            'message' => $isAdded ? '已點讚' : '已取消點讚',
            'like_count' => $review->likedUsers()->count() 
        ], 200);
    }
}
