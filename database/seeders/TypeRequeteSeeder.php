<?php

namespace Database\Seeders;

use App\Models\TypeRequete;
use Illuminate\Database\Seeder;

class TypeRequeteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Types de requêtes prédéfinis
        $typesRequetes = [
            [
                'nom' => 'Attestation de scolarité',
                'description' => 'Document certifiant l\'inscription et la scolarité de l\'étudiant',
                'delai_traitement_jours' => 3,
                'est_actif' => true,
            ],
            [
                'nom' => 'Relevé de notes',
                'description' => 'Document officiel présentant les notes obtenues par semestre',
                'delai_traitement_jours' => 5,
                'est_actif' => true,
            ],
            [
                'nom' => 'Diplôme',
                'description' => 'Diplôme officiel de fin d\'études',
                'delai_traitement_jours' => 10,
                'est_actif' => true,
            ],
            [
                'nom' => 'Certificat de stage',
                'description' => 'Attestation de réalisation de stage en entreprise',
                'delai_traitement_jours' => 7,
                'est_actif' => true,
            ],
            [
                'nom' => 'Duplicata de diplôme',
                'description' => 'Copie certifiée conforme du diplôme original',
                'delai_traitement_jours' => 15,
                'est_actif' => true,
            ],
            [
                'nom' => 'Attestation de réussite',
                'description' => 'Document attestant la réussite aux examens',
                'delai_traitement_jours' => 5,
                'est_actif' => true,
            ],
            [
                'nom' => 'Bulletin de notes',
                'description' => 'Relevé détaillé des notes par matière',
                'delai_traitement_jours' => 3,
                'est_actif' => true,
            ],
            [
                'nom' => 'Attestation d\'inscription',
                'description' => 'Preuve d\'inscription pour l\'année académique en cours',
                'delai_traitement_jours' => 2,
                'est_actif' => true,
            ],
        ];

        foreach ($typesRequetes as $typeRequete) {
            TypeRequete::create($typeRequete);
        }

        // Créer quelques types supplémentaires avec la factory
        TypeRequete::factory(5)->create();
    }
}
