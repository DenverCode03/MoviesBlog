<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roles = ['etudiant', 'secretaire', 'directeur', 'scolarite', 'superAdmin'];
        $role = fake()->randomElement($roles);

        // Générer un identifiant basé sur le rôle
        $identifiant = $this->generateIdentifiant($role);

        return [
            'nom' => fake()->name(),
            'identifiant' => $identifiant,
            'role' => $role,
            'email_verified_at' => fake()->boolean(80) ? now() : null,
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Generate a unique identifier based on role.
     */
    private function generateIdentifiant(string $role): string
    {
        $prefix = match ($role) {
            'etudiant' => 'ETU',
            'secretaire' => 'SEC',
            'directeur' => 'DIR',
            'scolarite' => 'SCO',
            'superAdmin' => 'ADM',
            default => 'USR'
        };

        return $prefix . fake()->unique()->numberBetween(1000, 9999);
    }

    /**
     * Indicate that the user is a student.
     */
    public function etudiant(): static
    {
        return $this->state(fn(array $attributes) => [
            'role' => 'etudiant',
            'identifiant' => 'ETU' . fake()->unique()->numberBetween(1000, 9999),
        ]);
    }

    /**
     * Indicate that the user is a secretary.
     */
    public function secretaire(): static
    {
        return $this->state(fn(array $attributes) => [
            'role' => 'secretaire',
            'identifiant' => 'SEC' . fake()->unique()->numberBetween(1000, 9999),
        ]);
    }

    /**
     * Indicate that the user is a director.
     */
    public function directeur(): static
    {
        return $this->state(fn(array $attributes) => [
            'role' => 'directeur',
            'identifiant' => 'DIR' . fake()->unique()->numberBetween(1000, 9999),
        ]);
    }

    /**
     * Indicate that the user is from scolarite.
     */
    public function scolarite(): static
    {
        return $this->state(fn(array $attributes) => [
            'role' => 'scolarite',
            'identifiant' => 'SCO' . fake()->unique()->numberBetween(1000, 9999),
        ]);
    }

    /**
     * Indicate that the user is a super admin.
     */
    public function superAdmin(): static
    {
        return $this->state(fn(array $attributes) => [
            'role' => 'superAdmin',
            'identifiant' => 'ADM' . fake()->unique()->numberBetween(1000, 9999),
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
