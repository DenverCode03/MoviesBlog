<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Requete extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'requetes';

    protected $fillable = [
        'statut',
        'priorite',
        'date_limite',
        'date_traitement',
        'motif_rejet',
        'commentaire_secretaire',
        'etudiant_id',
        'type_requete_id',
        'secretaire_id',
        'directeur_id',
    ];

    protected $casts = [
        'date_limite' => 'datetime',
        'date_traitement' => 'datetime',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function typeRequete(): BelongsTo
    {
        return $this->belongsTo(TypeRequete::class, 'type_requete_id');
    }

    public function secretaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'secretaire_id');
    }

    public function directeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'directeur_id');
    }

    public function requeteDocuments(): HasMany
    {
        return $this->hasMany(RequeteDocument::class, 'requete_id');
    }
}