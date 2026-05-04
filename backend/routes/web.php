<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\HistoryController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';

Route::get('/products/popular', [ProductController::class, 'popular']); 
Route::get('/products/most-viewed', [ProductController::class, 'mostViewed']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}/products', [CategoryController::class, 'show']);

Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);


Route::middleware('auth')->group(function () {
    
    Route::get('/carts', [CartController::class, 'index']);
    Route::post('/carts', [CartController::class, 'store']);
    Route::delete('/carts/{id}', [CartController::class, 'destroy']);   

    Route::post('/wishlists', [App\Http\Controllers\WishlistController::class, 'store']);
    Route::get('/wishlists', [App\Http\Controllers\WishlistController::class, 'index']);
    Route::delete('/wishlists/{id}', [App\Http\Controllers\WishlistController::class, 'destroy']); 

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

    Route::post('/products/{productId}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    
    Route::post('/reviews/{id}/toggle-like', [ReviewController::class, 'toggleLike']);

    Route::get('/history', [HistoryController::class, 'index']);
    Route::post('/history', [HistoryController::class, 'store']); 
    Route::delete('/history/{id}', [HistoryController::class, 'destroy']); 
    Route::delete('/history-clear', [HistoryController::class, 'clearAll']); 
});


Route::middleware(['auth', EnsureIsAdmin::class])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});