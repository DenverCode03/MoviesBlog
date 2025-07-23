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
        Schema::table('requete_documents', function (Blueprint $table) {
            $table->boolean('est_valide')->default(false)->after('taille_fichier');
            $table->text('commentaire_validation')->nullable()->after('est_valide');
            $table->timestamp('date_validation')->nullable()->after('commentaire_validation');
            $table->foreignId('validateur_id')->nullable()->constrained('users')->after('date_validation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requete_documents', function (Blueprint $table) {
            $table->dropForeign(['validateur_id']);
            $table->dropColumn(['est_valide', 'commentaire_validation', 'date_validation', 'validateur_id']);
        });
    }
};
