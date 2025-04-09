<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'image',
        'text',
        'likes',
        'user_id'
    ];

    public function author () {
        return $this->belongsTo(User::class);
    }

    public function users () {
        return $this->belongsToMany(User::class);
    }
}
