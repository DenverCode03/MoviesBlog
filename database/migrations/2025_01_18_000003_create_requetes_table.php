<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('requetes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('statut', [
                'en_attente', 
                'en_cours', 
                'validee', 
                'rejetee', 
                'terminee',
                'recuperee'
            ])->default('en_attente');
            $table->enum('priorite', ['basse', 'normale', 'haute', 'urgente'])->default('normale');
            $table->datetime('date_limite')->nullable();
            $table->datetime('date_traitement')->nullable();
            $table->text('motif_rejet')->nullable();
            $table->text('commentaire_secretaire')->nullable();
            
            // Relations
            $table->uuid('etudiant_id');
            $table->uuid('type_requete_id');
            $table->uuid('secretaire_id')->nullable();
            $table->uuid('directeur_id')->nullable();
            
            $table->foreign('etudiant_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('type_requete_id')->references('id')->on('type_requetes')->onDelete('cascade');
            $table->foreign('secretaire_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('directeur_id')->references('id')->on('users')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('requetes');
    }
};