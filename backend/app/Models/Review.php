<?php

namespace App\Models;

use Database\Factories\ReviewFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    /** @use HasFactory<ReviewFactory> */
    use HasFactory;
    protected $fillable = ['user_id', 'product_id', 'rating', 'comment', 'image_path'];

    public function user()
    {
        return $this -> belongsTo(User::class);
    }

    public function product()
    {
        return $this -> belongsTo(Product::class);
    }


    public function likedUsers()
    {
        return $this->belongsToMany(User::class, 'review_likes')->withTimestamps();
    }
}
