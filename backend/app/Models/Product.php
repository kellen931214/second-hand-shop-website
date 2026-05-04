<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'image_url', 'category_id', 'stock'];

    public function category()
    {
        return $this -> belongsTo(Category::class);
    }
    
    public function wishlistsByUsers()
    {
        return $this -> belongsToMany(User::class , 'wishlists');
    }

    public function inCartsOfUsers()
    {
        return $this -> belongsToMany(User::class , 'carts')->withPivot('quantity');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function reviews()
    { 
    return $this -> hasMany(Review::class);
    }

    public function viewedByUsers()
    {
    return $this->belongsToMany(User::class, 'product_views')
                ->withTimestamps(); 
    }
}
