<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'name',
        'place',
        'description',
    ];

    
    public function diffuse () {
        return $this->belongsTo(Film::class, 'fim_sale');
    }
    
    public function reservation () {
        return $this->belongsToMany(User::class, 'reservations');
    }
}
