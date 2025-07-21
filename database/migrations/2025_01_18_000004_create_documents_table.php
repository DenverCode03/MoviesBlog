<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->text('description')->nullable();
            
            $table->timestamps();
        });

        Schema::create('document_type_requete', function (Blueprint $table) {
            
            // Relation avec type de requête
            $table->uuid('type_requete_id');
            $table->foreign('type_requete_id')->references('id')->on('type_requetes')->onDelete('cascade');
            $table->uuid('document_id');
            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};