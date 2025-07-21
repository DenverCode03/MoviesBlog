<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\TypeRequete;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Requete>
 */
class RequeteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuts = ['en_attente', 'en_cours', 'validee', 'rejetee', 'terminee', 'recuperee'];
        $priorites = ['basse', 'normale', 'haute', 'urgente'];
        
        $statut = fake()->randomElement($statuts);
        $dateCreation = fake()->dateTimeBetween('-6 months', 'now');
        
        return [
            'statut' => $statut,
            'priorite' => fake()->randomElement($priorites),
            'date_limite' => fake()->dateTimeBetween($dateCreation, '+1 month'),
            'date_traitement' => in_array($statut, ['validee', 'rejetee', 'terminee', 'recuperee']) 
                ? fake()->dateTimeBetween($dateCreation, 'now') 
                : null,
            'motif_rejet' => $statut === 'rejetee' ? fake()->sentence(12) : null,
            'commentaire_secretaire' => fake()->boolean(30) ? fake()->sentence(15) : null,
            'etudiant_id' => User::factory(),
            'type_requete_id' => TypeRequete::factory(),
            'secretaire_id' => fake()->boolean(70) ? User::factory() : null,
            'directeur_id' => fake()->boolean(40) ? User::factory() : null,
            'created_at' => $dateCreation,
            'updated_at' => fake()->dateTimeBetween($dateCreation, 'now'),
        ];
    }

    /**
     * Indicate that the requete is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'en_attente',
            'date_traitement' => null,
            'motif_rejet' => null,
        ]);
    }

    /**
     * Indicate that the requete is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'rejetee',
            'date_traitement' => fake()->dateTimeBetween('-1 month', 'now'),
            'motif_rejet' => fake()->sentence(12),
        ]);
    }

    /**
     * Indicate that the requete is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'terminee',
            'date_traitement' => fake()->dateTimeBetween('-1 month', 'now'),
            'motif_rejet' => null,
        ]);
    }

    /**
     * Indicate that the requete has high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priorite' => 'haute',
        ]);
    }

    /**
     * Indicate that the requete is urgent.
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'priorite' => 'urgente',
        ]);
    }
}