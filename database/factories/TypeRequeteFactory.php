<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TypeRequete>
 */
class TypeRequeteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = [
            'Attestation de scolarité',
            'Relevé de notes',
            'Diplôme',
            'Certificat de stage',
            'Attestation de réussite',
            'Duplicata de diplôme',
            'Attestation d\'inscription',
            'Bulletin de notes',
            'Certificat de fin d\'études',
            'Attestation de présence'
        ];

        return [
            'nom' => fake()->randomElement($types),
            'description' => fake()->sentence(10),
            'delai_traitement_jours' => fake()->numberBetween(3, 15),
            'est_actif' => fake()->boolean(85), // 85% de chance d'être actif
        ];
    }

    /**
     * Indicate that the type requete is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'est_actif' => false,
        ]);
    }

    /**
     * Indicate that the type requete has urgent processing.
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'delai_traitement_jours' => fake()->numberBetween(1, 3),
        ]);
    }
}