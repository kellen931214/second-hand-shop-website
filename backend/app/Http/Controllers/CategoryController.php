<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category; 

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount(['products' => function ($query) {
            $query->where('stock', '>', 0);
        }])->get();
        
        return response()->json($categories);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);

        $products = $category->products()
                             ->where('stock', '>', 0) 
                             ->latest()               
                             ->paginate(12);          

        return response()->json([
            'category' => $category,
            'products' => $products
        ]);
    }
}