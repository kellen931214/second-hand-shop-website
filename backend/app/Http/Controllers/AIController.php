<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Gemini\Laravel\Facades\Gemini;
use Exception;

class AIController extends Controller
{
    public function askAboutProducts(Request $request)
    {
        $userQuery = $request->input('query'); 

        try {
            
            $products = Product::select('name', 'price', 'description', 'stock')
                        ->where('stock', '>', 0)
                        ->get();

            $productListString = $products->map(function($item) {
                return "- 商品名: {$item->name}, 價格: {$item->price}元, 描述: {$item->description}";
            })->implode("\n");

            $prompt = "你是一位校園二手平台的智能小幫手。以下是目前平台上所有的商品清單：\n\n" . 
                      $productListString . 
                      "\n\n請根據上方清單回答使用者的問題：'{$userQuery}'。" .
                      "如果商品存在，請詳細介紹；如果找不到，請禮貌地告知並推薦類似的東西（如果有）。";

            $result = Gemini::generativeModel(model: 'gemini-2.5-flash')
                ->generateContent($prompt);

            return response()->json([
                'answer' => $result->text()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => '伺服器執行錯誤',
                'message' => $e->getMessage(), 
                'file' => $e->getFile(),       
                    'line' => $e->getLine()        
                ], 500); 
        }
    }
}