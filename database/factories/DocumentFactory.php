<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $documents = [
            'Carte d\'identité',
            'Passeport',
            'Acte de naissance',
            'Certificat de résidence',
            'Photo d\'identité',
            'Justificatif de paiement',
            'Relevé bancaire',
            'Attestation d\'assurance',
            'Certificat médical',
            'Lettre de motivation',
            'CV',
            'Diplôme précédent',
            'Bulletin de salaire',
            'Contrat de travail'
        ];

        return [
            'nom' => fake()->randomElement($documents),
            'description' => fake()->sentence(8),
        ];
    }
}