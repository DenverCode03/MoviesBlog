<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\TypeRequete;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SuperAdminController extends Controller
{
    public function dashboard()
    {
        return inertia('SuperAdmin/Dashboard');
    }

    public function requetes(Request $request)
    {
        $query = TypeRequete::with('documents');

        // Filtrage par statut
        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('est_actif', true);
            } elseif ($request->status === 'inactive') {
                $query->where('est_actif', false);
            }
        }

        $typeRequetes = $query->orderBy('created_at', 'desc')->paginate(8);
        $documents = Document::all();

        // Statistiques pour les cards de filtre
        $stats = [
            'total' => TypeRequete::count(),
            'active' => TypeRequete::where('est_actif', true)->count(),
            'inactive' => TypeRequete::where('est_actif', false)->count(),
        ];

        return inertia('SuperAdmin/Requetes', [
            'typeRequetes' => $typeRequetes,
            'documents' => $documents,
            'stats' => $stats,
            'filters' => $request->only(['status'])
        ]);
    }

    public function storeTypeRequete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'delai_traitement_jours' => 'integer|min:1|max:365',
            'documents' => 'array',
            'documents.*' => 'exists:documents,id'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $typeRequete = TypeRequete::create([
            'nom' => $request->nom,
            'description' => $request->description,
            'delai_traitement_jours' => $request->delai_traitement_jours ?? 7,
            'est_actif' => true,
        ]);

        // Associer les documents
        if ($request->has('documents')) {
            $typeRequete->documents()->attach($request->documents);
        }

        return back()->with('success', 'Type de requête créé avec succès.');
    }

    public function updateTypeRequete(Request $request, TypeRequete $typeRequete)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'delai_traitement_jours' => 'integer|min:1|max:365',
            'documents' => 'array',
            'documents.*' => 'exists:documents,id'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $typeRequete->update([
            'nom' => $request->nom,
            'description' => $request->description,
            'delai_traitement_jours' => $request->delai_traitement_jours ?? $typeRequete->delai_traitement_jours,
        ]);

        // Synchroniser les documents
        if ($request->has('documents')) {
            $typeRequete->documents()->sync($request->documents);
        }

        return back()->with('success', 'Type de requête modifié avec succès.');
    }

    public function destroyTypeRequete(TypeRequete $typeRequete)
    {
        // Vérifier s'il y a des requêtes associées
        if ($typeRequete->requetes()->count() > 0) {
            return back()->with('error', 'Impossible de supprimer ce type de requête car il est utilisé par des requêtes existantes.');
        }

        $typeRequete->documents()->detach();
        $typeRequete->delete();

        return back()->with('success', 'Type de requête supprimé avec succès.');
    }

    public function toggleTypeRequeteStatus(TypeRequete $typeRequete)
    {
        $typeRequete->update([
            'est_actif' => !$typeRequete->est_actif
        ]);

        $status = $typeRequete->est_actif ? 'activé' : 'désactivé';
        return back()->with('success', "Type de requête {$status} avec succès.");
    }

    // Gestion des utilisateurs
    public function users(Request $request)
    {
        $query = User::query();

        // Filtrage par rôle
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Recherche par nom ou identifiant
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nom', 'like', '%' . $request->search . '%')
                    ->orWhere('identifiant', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        // Statistiques pour les cards de filtre
        $stats = [
            'total' => User::count(),
            'etudiant' => User::where('role', 'etudiant')->count(),
            'secretaire' => User::where('role', 'secretaire')->count(),
            'scolarite' => User::where('role', 'scolarite')->count(),
            'directeur' => User::where('role', 'directeur')->count(),
            'superAdmin' => User::where('role', 'superAdmin')->count(),
        ];

        return inertia('SuperAdmin/Users', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $request->only(['role', 'search'])
        ]);
    }

    public function storeUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'identifiant' => 'required|string|max:255|unique:users,identifiant',
            'role' => ['required', Rule::in(['etudiant', 'secretaire', 'directeur', 'scolarite', 'superAdmin'])],
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        User::create([
            'nom' => $request->nom,
            'identifiant' => $request->identifiant,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Utilisateur créé avec succès.');
    }

    public function updateUser(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'identifiant' => ['required', 'string', 'max:255', Rule::unique('users', 'identifiant')->ignore($user->id)],
            'role' => ['required', Rule::in(['etudiant', 'secretaire', 'directeur', 'scolarite', 'superAdmin'])],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $updateData = [
            'nom' => $request->nom,
            'identifiant' => $request->identifiant,
            'role' => $request->role,
        ];

        // Mettre à jour le mot de passe seulement s'il est fourni
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return back()->with('success', 'Utilisateur modifié avec succès.');
    }

    public function destroyUser(User $user)
    {
        // Empêcher la suppression de son propre compte
        if ($user->id === Auth::user()->id) {
            return back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }


        // Vérifier s'il y a des requêtes associées
        $requetesCount = $user->requetesEtudiant()->count() +
            $user->requetesSecretaire()->count() +
            $user->requetesDirecteur()->count();

        if ($requetesCount > 0) {
            return back()->with('error', 'Impossible de supprimer cet utilisateur car il est associé à des requêtes existantes.');
        }

        $user->delete();

        return back()->with('success', 'Utilisateur supprimé avec succès.');
    }

    public function resetUserPassword(User $user)
    {
        // Empêcher la réinitialisation de son propre mot de passe via cette méthode
        if ($user->id === Auth::user()->id) {
            return back()->with('error', 'Utilisez la page de profil pour modifier votre mot de passe.');
        }

        $newPassword = 'password123';
        $user->update([
            'password' => Hash::make($newPassword),
            'email_verified_at' => now(),
        ]);

        return back()->with('success', "Mot de passe réinitialisé. Nouveau mot de passe : {$newPassword}");
    }

    // Gestion des documents
    public function documents(Request $request)
    {
        $query = Document::withCount('typeRequetes');
        
        // Recherche par nom ou description
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nom', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }
        
        $documents = $query->orderBy('created_at', 'desc')->paginate(12);
        
        // Statistiques
        $stats = [
            'total' => Document::count(),
            'used' => Document::has('typeRequetes')->count(),
            'unused' => Document::doesntHave('typeRequetes')->count(),
        ];
        
        return inertia('SuperAdmin/Documents', [
            'documents' => $documents,
            'stats' => $stats,
            'filters' => $request->only(['search'])
        ]);
    }

    public function storeDocument(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:documents,nom',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Document::create([
            'nom' => $request->nom,
            'description' => $request->description,
        ]);

        return back()->with('success', 'Document créé avec succès.');
    }

    public function updateDocument(Request $request, Document $document)
    {
        $validator = Validator::make($request->all(), [
            'nom' => ['required', 'string', 'max:255', Rule::unique('documents', 'nom')->ignore($document->id)],
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $document->update([
            'nom' => $request->nom,
            'description' => $request->description,
        ]);

        return back()->with('success', 'Document modifié avec succès.');
    }

    public function destroyDocument(Document $document)
    {
        // Vérifier s'il y a des types de requêtes associés
        if ($document->typeRequetes()->count() > 0) {
            return back()->with('error', 'Impossible de supprimer ce document car il est utilisé par des types de requêtes existants.');
        }

        // Vérifier s'il y a des requêtes documents associés
        if ($document->requeteDocuments()->count() > 0) {
            return back()->with('error', 'Impossible de supprimer ce document car il est utilisé dans des requêtes existantes.');
        }

        $document->delete();

        return back()->with('success', 'Document supprimé avec succès.');
    }

    public function showDocumentUsage(Document $document)
    {
        $document->load(['typeRequetes', 'requeteDocuments.requete.etudiant']);
        
        return inertia('SuperAdmin/DocumentUsage', [
            'document' => $document
        ]);
    }
}
