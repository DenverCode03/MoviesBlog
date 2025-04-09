<?php

use App\Models\Category;
use App\Models\Film;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        
        Schema::create('category_films', function (Blueprint $table) {
            $table->foreignIdFor(Category::class);
            $table->foreignIdFor(Film::class);
            $table->boolean('islike');
            $table->text('comment'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_films');
    }
};
