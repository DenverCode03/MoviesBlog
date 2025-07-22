<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nom',
        'identifiant',
        'role',
        'password',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Requêtes soumises par l'utilisateur (en tant qu'étudiant)
     */
    public function requetesEtudiant(): HasMany
    {
        return $this->hasMany(Requete::class, 'etudiant_id');
    }

    /**
     * Requêtes traitées par l'utilisateur (en tant que secrétaire)
     */
    public function requetesSecretaire(): HasMany
    {
        return $this->hasMany(Requete::class, 'secretaire_id');
    }

    /**
     * Requêtes validées par l'utilisateur (en tant que directeur)
     */
    public function requetesDirecteur(): HasMany
    {
        return $this->hasMany(Requete::class, 'directeur_id');
    }
}
