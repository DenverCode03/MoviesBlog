<?php

namespace Database\Factories;

use App\Models\Requete;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RequeteDocument>
 */
class RequeteDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $extensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
        $extension = fake()->randomElement($extensions);
        $fileName = fake()->slug(3) . '.' . $extension;
        
        return [
            'requete_id' => Requete::factory(),
            'document_id' => Document::factory(),
            'nom_fichier_original' => $fileName,
            'chemin_stockage' => 'documents/requetes/' . fake()->uuid() . '/' . $fileName,
        ];
    }
}