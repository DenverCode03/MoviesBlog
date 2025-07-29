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
        'date_approbation',
        'date_debut_traitement_organisme',
        'date_fin_traitement_organisme',
        'date_finalisation',
        'motif_rejet',
        'motif_rejet_directeur',
        'motif_rejet_organisme',
        'commentaire_secretaire',
        'commentaire_directeur',
        'commentaire_organisme',
        'document_resultat_path',
        'document_resultat_nom',
        'etudiant_id',
        'type_requete_id',
        'secretaire_id',
        'directeur_id',
        'organisme_responsable_id',
        'date_envoi_organisme',
    ];

    protected $casts = [
        'date_limite' => 'datetime',
        'date_traitement' => 'datetime',
        'date_approbation' => 'datetime',
        'date_envoi_organisme' => 'datetime',
        'date_debut_traitement_organisme' => 'datetime',
        'date_fin_traitement_organisme' => 'datetime',
        'date_finalisation' => 'datetime',
    ];

    protected $with = ['organismeResponsable', 'requeteDocuments', 'directeur', 'secretaire'];

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

    public function organismeResponsable(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organisme_responsable_id');
    }
}