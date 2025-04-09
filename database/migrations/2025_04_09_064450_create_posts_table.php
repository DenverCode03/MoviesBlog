<?php

use App\Models\Film;
use App\Models\Post;
use App\Models\User;
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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('image');
            $table->text('text');
            $table->integer('likes');
            $table->foreignIdFor(User::class);
            $table->timestamps();
        });

        Schema::create('post_users', function (Blueprint $table) {
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Post::class);
            $table->boolean('islike');
            $table->text('comment'); 
        });

        Schema::create('film_users', function (Blueprint $table) {
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Film::class);
            $table->boolean('islike');
            $table->text('comment'); 
        });

        Schema::create('reservations', function (Blueprint $table) {
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Film::class);
            $table->date('date');
            $table->time('hour'); 
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
        Schema::dropIfExists('post_user');
        Schema::dropIfExists('film_user');
        Schema::dropIfExists('reservations');
    }
};
