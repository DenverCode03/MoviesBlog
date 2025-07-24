<?php

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
        Schema::table('requetes', function (Blueprint $table) {
            $table->timestamp('date_debut_traitement_organisme')->nullable()->after('date_envoi_organisme');
            $table->timestamp('date_fin_traitement_organisme')->nullable()->after('date_debut_traitement_organisme');
            $table->timestamp('date_finalisation')->nullable()->after('date_fin_traitement_organisme');
            $table->text('motif_rejet_organisme')->nullable()->after('motif_rejet_directeur');
            $table->text('commentaire_organisme')->nullable()->after('commentaire_directeur');
            $table->string('document_resultat_path')->nullable()->after('commentaire_organisme');
            $table->string('document_resultat_nom')->nullable()->after('document_resultat_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requetes', function (Blueprint $table) {
            $table->dropColumn([
                'date_debut_traitement_organisme',
                'date_fin_traitement_organisme',
                'date_finalisation',
                'motif_rejet_organisme',
                'commentaire_organisme',
                'document_resultat_path',
                'document_resultat_nom'
            ]);
        });
    }
};
