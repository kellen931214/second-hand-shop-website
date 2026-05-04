<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['user_id', 'product_id', 'rating', 'comment', 'image_path'];

    public function user()
    {
        return $this -> belongsTo(User::class);
    }

    public function product()
    {
        return $this -> belongsTo(Product::class);
    }

    public function likers()
    {
        return $this->belongsToMany(User::class, 'review_likes')->withTimestamps();
    }
}
