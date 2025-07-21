<?php

namespace Database\Seeders;

use App\Models\RequeteDocument;
use App\Models\Requete;
use App\Models\Document;
use Illuminate\Database\Seeder;

class RequeteDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $requetes = Requete::all();
        $documents = Document::all();

        if ($requetes->isEmpty() || $documents->isEmpty()) {
            $this->command->warn('Aucune requête ou document trouvé. Veuillez d\'abord exécuter RequeteSeeder et DocumentSeeder.');
            return;
        }

        // Pour chaque requête, créer 1 à 3 documents associés
        foreach ($requetes as $requete) {
            $nombreDocuments = rand(1, 3);
            $documentsSelectionnes = $documents->random($nombreDocuments);

            foreach ($documentsSelectionnes as $document) {
                RequeteDocument::factory()->create([
                    'requete_id' => $requete->id,
                    'document_id' => $document->id,
                ]);
            }
        }
    }
}