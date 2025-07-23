<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Requete;
use App\Models\RequeteDocument;
use App\Models\TypeRequete;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class EtudiantController extends Controller
{
    public function mesRequetes(Request $request)
    {
        $user = Auth::user();

        // Filtres
        $statut = $request->get('statut', 'all');
        $search = $request->get('search', '');

        // Query de base
        $query = Requete::where('etudiant_id', $user->id)
            ->with(['typeRequete', 'secretaire', 'directeur', 'requeteDocuments.document']);

        // Filtrage par statut
        if ($statut !== 'all') {
            $query->where('statut', $statut);
        }

        // Recherche
        if ($search) {
            $query->whereHas('typeRequete', function ($q) use ($search) {
                $q->where('nom', 'like', '%' . $search . '%');
            });
        }

        $requetes = $query->orderBy('created_at', 'desc')->paginate(10);

        // Statistiques
        $stats = [
            'total' => Requete::where('etudiant_id', $user->id)->count(),
            'en_attente' => Requete::where('etudiant_id', $user->id)->where('statut', 'en_attente')->count(),
            'en_cours' => Requete::where('etudiant_id', $user->id)->where('statut', 'en_cours')->count(),
            'validees' => Requete::where('etudiant_id', $user->id)->where('statut', 'validee')->count(),
            'terminees' => Requete::where('etudiant_id', $user->id)->where('statut', 'terminee')->count(),
            'rejetees' => Requete::where('etudiant_id', $user->id)->where('statut', 'rejetee')->count(),
            'recuperees' => Requete::where('etudiant_id', $user->id)->where('statut', 'recuperee')->count(),
        ];

        // Types de requêtes disponibles avec recherche
        $searchTypes = $request->get('search_types', '');
        $typesQuery = TypeRequete::where('est_actif', true)
            ->with(['documents'])
            ->withCount('requetes');

        if ($searchTypes) {
            $typesQuery->where(function ($q) use ($searchTypes) {
                $q->where('nom', 'like', '%' . $searchTypes . '%')
                    ->orWhere('description', 'like', '%' . $searchTypes . '%');
            });
        }

        $typesDisponibles = $typesQuery->orderBy('nom')->paginate(6, ['*'], 'types_page');

        return inertia('Etudiant/MesRequetes', [
            'requetes' => $requetes,
            'stats' => $stats,
            'typesDisponibles' => $typesDisponibles,
            'filters' => [
                'statut' => $statut,
                'search' => $search,
                'search_types' => $searchTypes
            ]
        ]);
    }

    public function create()
    {
        // Types de requêtes actifs avec leurs documents
        $typeRequetes = TypeRequete::where('est_actif', true)
            ->with('documents')
            ->orderBy('nom')
            ->get();

        return inertia('Etudiant/NouvelleRequete', [
            'typeRequetes' => $typeRequetes
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type_requete_id' => 'required|exists:type_requetes,id',
            'priorite' => 'in:basse,normale,haute,urgente',
            'commentaire' => 'nullable|string|max:1000',
            'documents' => 'array',
            'documents.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $user = Auth::user();
        $typeRequete = TypeRequete::findOrFail($request->type_requete_id);

        // Calculer la date limite
        $dateLimite = Carbon::now()->addDays($typeRequete->delai_traitement_jours);

        // Créer la requête
        $requete = Requete::create([
            'etudiant_id' => $user->id,
            'type_requete_id' => $request->type_requete_id,
            'statut' => 'en_attente',
            'priorite' => $request->priorite ?? 'normale',
            'date_limite' => $dateLimite,
        ]);

        // Traiter les documents uploadés
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $documentId => $file) {
                if ($file && $file->isValid()) {
                    // Vérifier que le document est requis pour ce type de requête
                    $document = Document::findOrFail($documentId);
                    if (!$typeRequete->documents->contains($document)) {
                        continue; // Skip si le document n'est pas requis
                    }

                    // Générer un nom unique pour le fichier
                    $fileName = time() . '_' . $documentId . '_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('requetes/' . $requete->id, $fileName, 'public');

                    // Enregistrer en base
                    RequeteDocument::create([
                        'requete_id' => $requete->id,
                        'document_id' => $documentId,
                        'nom_fichier_original' => $file->getClientOriginalName(),
                        'chemin_stockage' => $filePath,
                    ]);
                }
            }
        }

        return redirect()->route('etudiant.mes-requetes')
            ->with('success', 'Votre requête a été soumise avec succès. Vous recevrez une notification lors du traitement.');
    }

    public function show(Requete $requete)
    {
        // dd($requete->etudiant_id . '/' . Auth::user()->id);
        // Vérifier que la requête appartient à l'étudiant connecté
        if ($requete->etudiant_id != Auth::user()->id) {
            abort(403, 'Accès non autorisé à cette requête.');
        }

        $requete->load([
            'typeRequete.documents',
            'secretaire',
            'directeur',
            'requeteDocuments.document'
        ]);

        return inertia('Etudiant/DetailRequete', [
            'requete' => $requete
        ]);
    }

    public function downloadDocument(RequeteDocument $requeteDocument)
    {
        // Vérifier que le document appartient à l'étudiant connecté
        if ($requeteDocument->requete->etudiant_id != Auth::user()->id) {
            abort(403, 'Accès non autorisé à ce document.');
        }

        $filePath = storage_path('app/public/' . $requeteDocument->chemin_stockage);

        if (!file_exists($filePath)) {
            return back()->with('error', 'Le fichier demandé n\'existe plus.');
        }

        return response()->download($filePath, $requeteDocument->nom_fichier_original);
    }

    public function markAsRecupere(Requete $requete)
    {
        // Vérifier que la requête appartient à l'étudiant connecté
        if ($requete->etudiant_id !== Auth::user()->id) {
            abort(403, 'Accès non autorisé à cette requête.');
        }

        // Vérifier que la requête est terminée
        if ($requete->statut !== 'terminee') {
            return back()->with('error', 'Cette requête n\'est pas encore terminée.');
        }

        $requete->update([
            'statut' => 'recuperee'
        ]);

        return back()->with('success', 'Requête marquée comme récupérée.');
    }

    public function cancel(Requete $requete)
    {
        // Vérifier que la requête appartient à l'étudiant connecté
        if ($requete->etudiant_id !== Auth::user()->id) {
            abort(403, 'Accès non autorisé à cette requête.');
        }

        // Vérifier que la requête peut être annulée (seulement en attente)
        if ($requete->statut !== 'en_attente') {
            return back()->with('error', 'Cette requête ne peut plus être annulée car elle est déjà en cours de traitement.');
        }

        // Supprimer les documents associés
        foreach ($requete->requeteDocuments as $requeteDocument) {
            Storage::disk('public')->delete($requeteDocument->chemin_stockage);
            $requeteDocument->delete();
        }

        // Supprimer la requête
        $requete->delete();

        return redirect()->route('etudiant.mes-requetes')
            ->with('success', 'Votre requête a été annulée avec succès.');
    }
}
