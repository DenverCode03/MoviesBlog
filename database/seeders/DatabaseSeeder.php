<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Début du seeding de la base de données...');

        // 1. Créer des utilisateurs de test
        $this->command->info('👥 Création des utilisateurs...');
        
        // Utilisateur super admin de test
        User::factory()->superAdmin()->create([
            'nom' => 'Super Admin',
            'identifiant' => 'ADM0001',
        ]);

        // Utilisateur directeur de test
        User::factory()->directeur()->create([
            'nom' => 'Directeur Test',
            'identifiant' => 'DIR0001',
        ]);

        // Utilisateur secrétaire de test
        User::factory()->secretaire()->create([
            'nom' => 'Secrétaire Test',
            'identifiant' => 'SEC0001',
        ]);

        // Utilisateur scolarité de test
        User::factory()->scolarite()->create([
            'nom' => 'Scolarité Test',
            'identifiant' => 'SCO0001',
        ]);

        // Utilisateur étudiant de test
        User::factory()->etudiant()->create([
            'nom' => 'Étudiant Test',
            'identifiant' => 'ETU0001',
        ]);

        // Créer des utilisateurs supplémentaires par rôle
        User::factory(10)->etudiant()->create();      // 10 étudiants
        User::factory(3)->secretaire()->create();     // 3 secrétaires
        User::factory(2)->scolarite()->create();      // 2 agents scolarité
        User::factory(1)->directeur()->create();      // 1 directeur supplémentaire

        // 2. Créer les types de requêtes
        $this->command->info('📋 Création des types de requêtes...');
        $this->call(TypeRequeteSeeder::class);

        // 3. Créer les documents
        $this->command->info('📄 Création des documents...');
        $this->call(DocumentSeeder::class);

        // 4. Créer les requêtes
        $this->command->info('📝 Création des requêtes...');
        $this->call(RequeteSeeder::class);

        // 5. Associer les documents aux requêtes
        $this->command->info('🔗 Association des documents aux requêtes...');
        $this->call(RequeteDocumentSeeder::class);

        $this->command->info('✅ Seeding terminé avec succès !');
        $this->command->info('');
        $this->command->info('🔑 Comptes de test créés :');
        $this->command->info('   Super Admin: ADM0001 (Super Admin)');
        $this->command->info('   Directeur: DIR0001 (Directeur Test)');
        $this->command->info('   Secrétaire: SEC0001 (Secrétaire Test)');
        $this->command->info('   Scolarité: SCO0001 (Scolarité Test)');
        $this->command->info('   Étudiant: ETU0001 (Étudiant Test)');
        $this->command->info('   Mot de passe pour tous: password');
        $this->command->info('');
        $this->command->info('📊 Statistiques :');
        $this->command->info('   - 21 utilisateurs au total');
        $this->command->info('   - 11 étudiants (1 test + 10 générés)');
        $this->command->info('   - 4 secrétaires (1 test + 3 générés)');
        $this->command->info('   - 3 agents scolarité (1 test + 2 générés)');
        $this->command->info('   - 2 directeurs (1 test + 1 généré)');
        $this->command->info('   - 1 super admin');
    }
}
