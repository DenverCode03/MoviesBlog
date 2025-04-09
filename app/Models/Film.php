<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
        'categorie',
        'duration',
        'rating',
    ];

    public function categories () {
        return $this->belongsToMany(Category::class);
    }

    public function reservation () {
        return $this->belongsToMany(User::class, 'reservations');
    }

    public function diffuse () {
        return $this->belongsToMany(Sale::class, 'film_sale');
    }

    public function react () {
        return $this->belongsToMany(User::class, 'film_users');
    }
}
