<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('requete_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('requete_id');
            $table->uuid('document_id');
            $table->string('nom_fichier_original')->nullabble();
            $table->string('chemin_stockage');
            
            $table->foreign('requete_id')->references('id')->on('requetes')->onDelete('cascade');
            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('depot_requete_documents');
    }
};