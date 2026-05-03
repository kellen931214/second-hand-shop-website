<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
Route::get('/products/popular', [App\Http\Controllers\ProductController::class, 'popular']); 
Route::get('/products/most-viewed', [App\Http\Controllers\ProductController::class, 'mostViewed']);
Route::get('/products',[App\Http\Controllers\ProductController::class,'index']);
Route::get('/products/{id}',[App\Http\Controllers\ProductController::class,'show']);
Route::get('/categories',[App\Http\Controllers\CategoryController::class,'index']);
Route::get('/categories/{id}/products',[App\Http\Controllers\CategoryController::class,'products']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/carts', [App\Http\Controllers\CartController::class, 'store']);
    Route::get('/carts', [App\Http\Controllers\CartController::class, 'index']);
    Route::delete('/carts/{id}', [App\Http\Controllers\CartController::class, 'destroy']);

    Route::post('/orders', [App\Http\Controllers\OrderController::class, 'store']);
    Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index']);
    Route::delete('/orders/{id}', [App\Http\Controllers\OrderController::class, 'destroy']);

    Route::post('/wishlists', [App\Http\Controllers\WishlistController::class, 'store']);
    Route::get('/wishlists', [App\Http\Controllers\WishlistController::class, 'index']);
    Route::delete('/wishlists/{id}', [App\Http\Controllers\WishlistController::class, 'destroy']);

    Route::post('/reviews', [App\Http\Controllers\ReviewController::class, 'store']);
    Route::get('/reviews', [App\Http\Controllers\ReviewController::class, 'index']);
    Route::delete('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'destroy']);
    Route::put('/reviews/{id}', [App\Http\Controllers\ReviewController::class, 'update']);

    Route::get('/orders/{order_id}', [App\Http\Controllers\OrderController::class, 'show']);
});


Route::middleware(['auth:sanctum', EnsureIsAdmin::class])->group(function () {
    Route::post('/products', [App\Http\Controllers\ProductController::class, 'store']);
    Route::put('/products/{id}', [App\Http\Controllers\ProductController::class, 'update']);
    Route::delete('/products/{id}', [App\Http\Controllers\ProductController::class, 'destroy']);
});