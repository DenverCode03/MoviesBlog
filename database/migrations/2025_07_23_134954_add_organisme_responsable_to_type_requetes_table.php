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
        Schema::table('type_requetes', function (Blueprint $table) {
            $table->foreignId('organisme_responsable_id')->nullable()->constrained('users')->after('delai_traitement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('type_requetes', function (Blueprint $table) {
            $table->dropForeign(['organisme_responsable_id']);
            $table->dropColumn('organisme_responsable_id');
        });
    }
};
