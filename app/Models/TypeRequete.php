<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TypeRequete extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'type_requetes';

    protected $fillable = [
        'nom',
        'description',
        'delai_traitement_jours',
        'est_actif',
        'organisme_responsable_id',
    ];

    protected $casts = [
        'est_actif' => 'boolean',
        'delai_traitement_jours' => 'integer',
    ];

    public function requetes(): HasMany
    {
        return $this->hasMany(Requete::class, 'type_requete_id');
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_type_requete', 'type_requete_id', 'document_id')
                    ->withTimestamps();
    }

    public function organismeResponsable()
    {
        return $this->belongsTo(User::class, 'organisme_responsable_id');
    }
}