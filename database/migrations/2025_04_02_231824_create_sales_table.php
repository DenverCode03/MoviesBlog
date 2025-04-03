<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Film;
use App\Models\Sale;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('place');
            $table->string('description');
            $table->timestamps();
        });

        schema::create('film_sale', function (Blueprint $table) {
            $table->foreignIdFor(Film::class);
            $table->foreignIdFor(Sale::class);
            $table->date('date');
            $table->time('time');
            $table->integer('place');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
        Schema::dropIfExists('film_sale');
    }
};
