<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequeteDocument extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'requete_documents';

    protected $fillable = [
        'requete_id',
        'document_id',
        'nom_fichier_original',
        'chemin_stockage',
    ];

    public function requete(): BelongsTo
    {
        return $this->belongsTo(Requete::class, 'requete_id');
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}