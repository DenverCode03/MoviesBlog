<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'documents';

    protected $fillable = [
        'nom',
        'description',
    ];

    public function typeRequetes(): BelongsToMany
    {
        return $this->belongsToMany(TypeRequete::class, 'document_type_requete', 'document_id', 'type_requete_id')
                    ->withTimestamps();
    }

    public function requeteDocuments(): HasMany
    {
        return $this->hasMany(RequeteDocument::class, 'document_id');
    }
}