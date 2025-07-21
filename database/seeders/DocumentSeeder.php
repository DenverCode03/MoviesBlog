<?php

namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Documents requis prédéfinis
        $documents = [
            [
                'nom' => 'Carte d\'identité',
                'description' => 'Pièce d\'identité officielle avec photo',
            ],
            [
                'nom' => 'Photo d\'identité',
                'description' => 'Photo récente format identité (4x3 cm)',
            ],
            [
                'nom' => 'Justificatif de paiement',
                'description' => 'Preuve de paiement des frais de scolarité',
            ],
            [
                'nom' => 'Acte de naissance',
                'description' => 'Extrait d\'acte de naissance de moins de 3 mois',
            ],
            [
                'nom' => 'Certificat de résidence',
                'description' => 'Justificatif de domicile récent',
            ],
            [
                'nom' => 'Diplôme précédent',
                'description' => 'Copie certifiée du dernier diplôme obtenu',
            ],
            [
                'nom' => 'Relevé bancaire',
                'description' => 'Relevé de compte des 3 derniers mois',
            ],
            [
                'nom' => 'Attestation d\'assurance',
                'description' => 'Preuve de couverture d\'assurance étudiant',
            ],
            [
                'nom' => 'Certificat médical',
                'description' => 'Certificat médical de moins de 3 mois',
            ],
            [
                'nom' => 'Lettre de motivation',
                'description' => 'Lettre manuscrite expliquant la demande',
            ],
        ];

        foreach ($documents as $document) {
            Document::create($document);
        }

        // Créer quelques documents supplémentaires avec la factory
        Document::factory(10)->create();
    }
}