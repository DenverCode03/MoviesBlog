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
            $table->timestamp('date_approbation')->nullable()->after('date_traitement');
            $table->text('motif_rejet_directeur')->nullable()->after('motif_rejet');
            $table->text('commentaire_directeur')->nullable()->after('commentaire_secretaire');
            $table->foreignId('organisme_responsable_id')->nullable()->constrained('users')->after('directeur_id');
            $table->timestamp('date_envoi_organisme')->nullable()->after('organisme_responsable_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requetes', function (Blueprint $table) {
            $table->dropForeign(['organisme_responsable_id']);
            $table->dropColumn([
                'date_approbation',
                'motif_rejet_directeur', 
                'commentaire_directeur',
                'organisme_responsable_id',
                'date_envoi_organisme'
            ]);
        });
    }
};
