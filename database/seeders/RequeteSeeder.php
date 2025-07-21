<?php

namespace Database\Seeders;

use App\Models\Requete;
use App\Models\User;
use App\Models\TypeRequete;
use Illuminate\Database\Seeder;

class RequeteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // S'assurer qu'on a des utilisateurs et types de requêtes
        $etudiants = User::all();
        $typeRequetes = TypeRequete::all();

        if ($etudiants->isEmpty() || $typeRequetes->isEmpty()) {
            $this->command->warn('Aucun utilisateur ou type de requête trouvé. Veuillez d\'abord exécuter UserSeeder et TypeRequeteSeeder.');
            return;
        }

        // Créer des requêtes avec différents statuts
        foreach ($etudiants->take(10) as $etudiant) {
            // Requêtes en attente
            Requete::factory()
                ->pending()
                ->create([
                    'etudiant_id' => $etudiant->id,
                    'type_requete_id' => $typeRequetes->random()->id,
                ]);

            // Requêtes en cours
            Requete::factory()
                ->create([
                    'statut' => 'en_cours',
                    'etudiant_id' => $etudiant->id,
                    'type_requete_id' => $typeRequetes->random()->id,
                    'secretaire_id' => $etudiants->random()->id,
                ]);

            // Requêtes terminées
            Requete::factory()
                ->completed()
                ->create([
                    'etudiant_id' => $etudiant->id,
                    'type_requete_id' => $typeRequetes->random()->id,
                    'secretaire_id' => $etudiants->random()->id,
                ]);
        }

        // Créer quelques requêtes rejetées
        Requete::factory(5)
            ->rejected()
            ->create([
                'etudiant_id' => $etudiants->random()->id,
                'type_requete_id' => $typeRequetes->random()->id,
                'secretaire_id' => $etudiants->random()->id,
            ]);

        // Créer quelques requêtes urgentes
        Requete::factory(3)
            ->urgent()
            ->create([
                'etudiant_id' => $etudiants->random()->id,
                'type_requete_id' => $typeRequetes->random()->id,
            ]);

        // Créer des requêtes aléatoires supplémentaires
        Requete::factory(20)->create([
            'etudiant_id' => fn() => $etudiants->random()->id,
            'type_requete_id' => fn() => $typeRequetes->random()->id,
            'secretaire_id' => fn() => $etudiants->random()->id,
        ]);
    }
}