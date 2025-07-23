<?php

namespace App\Http\Controllers;

use App\Models\Requete;
use App\Models\RequeteDocument;
use App\Models\TypeRequete;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class SecretaireController extends Controller
{
    public function traitement(Request $request)
    {
        $user = Auth::user();
        
        // Filtres
        $statut = $request->get('statut', 'en_attente');
        $priorite = $request->get('priorite', 'all');
        $search = $request->get('search', '');
        $type_requete = $request->get('type_requete', 'all');
        
        // Query de base - requêtes à traiter
        $query = Requete::with(['etudiant', 'typeRequete', 'secretaire', 'requeteDocuments.document']);
        
        // Filtrage par statut
        if ($statut !== 'all') {
            $query->where('statut', $statut);
        }
        
        // Filtrage par priorité
        if ($priorite !== 'all') {
            $query->where('priorite', $priorite);
        }
        
        // Filtrage par type de requête
        if ($type_requete !== 'all') {
            $query->where('type_requete_id', $type_requete);
        }
        
        // Recherche par nom d'étudiant ou type de requête
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereHas('etudiant', function($subQ) use ($search) {
                    $subQ->where('nom', 'like', '%' . $search . '%')
                         ->orWhere('identifiant', 'like', '%' . $search . '%');
                })
                ->orWhereHas('typeRequete', function($subQ) use ($search) {
                    $subQ->where('nom', 'like', '%' . $search . '%');
                });
            });
        }
        
        $requetes = $query->orderByRaw("CASE priorite WHEN 'urgente' THEN 1 WHEN 'haute' THEN 2 WHEN 'normale' THEN 3 WHEN 'basse' THEN 4 ELSE 5 END")
                          ->orderBy('created_at', 'asc')
                          ->paginate(15);
        
        // Statistiques pour les filtres
        $stats = [
            'en_attente' => Requete::where('statut', 'en_attente')->count(),
            'en_cours' => Requete::where('statut', 'en_cours')->count(),
            'validees' => Requete::where('statut', 'validee')->count(),
            'rejetees' => Requete::where('statut', 'rejetee')->count(),
            'urgentes' => Requete::where('priorite', 'urgente')->whereIn('statut', ['en_attente', 'en_cours'])->count(),
        ];
        
        // Types de requêtes pour le filtre
        $typesRequetes = TypeRequete::where('est_actif', true)->orderBy('nom')->get();
        
        return inertia('Secretaire/Traitement', [
            'requetes' => $requetes,
            'stats' => $stats,
            'typesRequetes' => $typesRequetes,
            'filters' => [
                'statut' => $statut,
                'priorite' => $priorite,
                'search' => $search,
                'type_requete' => $type_requete
            ]
        ]);
    }

    public function show(Requete $requete)
    {
        $requete->load([
            'etudiant',
            'typeRequete.documents',
            'secretaire',
            'directeur',
            'requeteDocuments.document'
        ]);
        
        return inertia('Secretaire/DetailRequete', [
            'requete' => $requete
        ]);
    }

    public function prendre(Requete $requete)
    {
        // Vérifier que la requête est en attente
        if ($requete->statut !== 'en_attente') {
            return back()->with('error', 'Cette requête ne peut plus être prise en charge.');
        }
        
        $requete->update([
            'statut' => 'en_cours',
            'secretaire_id' => Auth::id()
        ]);
        
        return back()->with('success', 'Requête prise en charge avec succès.');
    }

    public function valider(Request $request, Requete $requete)
    {
        $validator = Validator::make($request->all(), [
            'commentaire_secretaire' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Vérifier que la requête est en cours et assignée au secrétaire connecté
        if ($requete->statut !== 'en_cours' || $requete->secretaire_id !== Auth::id()) {
            return back()->with('error', 'Vous ne pouvez pas valider cette requête.');
        }
        
        $requete->update([
            'statut' => 'validee',
            'date_traitement' => Carbon::now(),
            'commentaire_secretaire' => $request->commentaire_secretaire,
        ]);
        
        return back()->with('success', 'Requête validée avec succès. Elle est maintenant en attente de finalisation par la direction.');
    }

    public function rejeter(Request $request, Requete $requete)
    {
        $validator = Validator::make($request->all(), [
            'motif_rejet' => 'required|string|max:1000',
            'commentaire_secretaire' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Vérifier que la requête est en cours et assignée au secrétaire connecté
        if ($requete->statut !== 'en_cours' || $requete->secretaire_id !== Auth::id()) {
            return back()->with('error', 'Vous ne pouvez pas rejeter cette requête.');
        }
        
        $requete->update([
            'statut' => 'rejetee',
            'date_traitement' => Carbon::now(),
            'motif_rejet' => $request->motif_rejet,
            'commentaire_secretaire' => $request->commentaire_secretaire,
        ]);
        
        return back()->with('success', 'Requête rejetée. L\'étudiant sera notifié du motif de rejet.');
    }

    public function finaliser(Request $request, Requete $requete)
    {
        $validator = Validator::make($request->all(), [
            'commentaire_secretaire' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Vérifier que la requête est validée
        if ($requete->statut !== 'validee') {
            return back()->with('error', 'Cette requête n\'est pas encore validée.');
        }
        
        $requete->update([
            'statut' => 'terminee',
            'date_traitement' => Carbon::now(),
            'commentaire_secretaire' => $request->commentaire_secretaire,
        ]);
        
        return back()->with('success', 'Requête finalisée avec succès. L\'étudiant peut maintenant récupérer son document.');
    }

    public function downloadDocument(RequeteDocument $requeteDocument)
    {
        $filePath = storage_path('app/public/' . $requeteDocument->chemin_stockage);
        
        if (!file_exists($filePath)) {
            return back()->with('error', 'Le fichier demandé n\'existe plus.');
        }
        
        return response()->download($filePath, $requeteDocument->nom_fichier_original);
    }

    public function previewDocument(RequeteDocument $requeteDocument)
    {
        $filePath = storage_path('app/public/' . $requeteDocument->chemin_stockage);
        
        if (!file_exists($filePath)) {
            return response()->json(['error' => 'Le fichier demandé n\'existe plus.'], 404);
        }
        
        $mimeType = mime_content_type($filePath);
        
        // Vérifier si le fichier peut être prévisualisé
        $previewableTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif',
            'text/plain',
            'text/html'
        ];
        
        if (!in_array($mimeType, $previewableTypes)) {
            return response()->json([
                'error' => 'Ce type de fichier ne peut pas être prévisualisé.',
                'downloadable' => true
            ], 400);
        }
        
        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $requeteDocument->nom_fichier_original . '"'
        ]);
    }

    public function validateDocuments(Request $request, Requete $requete)
    {
        // Vérifier que la requête est en cours et assignée au secrétaire connecté
        if ($requete->statut !== 'en_cours' || $requete->secretaire_id !== Auth::id()) {
            return response()->json(['error' => 'Vous ne pouvez pas valider cette requête.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'documents_valides' => 'required|array',
            'documents_valides.*' => 'boolean',
            'commentaires' => 'nullable|array',
            'commentaires.*' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $documentsValides = $request->input('documents_valides', []);
        $commentaires = $request->input('commentaires', []);
        
        // Mettre à jour le statut de validation des documents
        foreach ($requete->requeteDocuments as $requeteDocument) {
            $isValid = $documentsValides[$requeteDocument->id] ?? false;
            $commentaire = $commentaires[$requeteDocument->id] ?? null;
            
            $requeteDocument->update([
                'est_valide' => $isValid,
                'commentaire_validation' => $commentaire,
                'date_validation' => $isValid ? now() : null,
                'validateur_id' => $isValid ? Auth::id() : null
            ]);
        }

        // Vérifier si tous les documents requis sont validés
        $documentsRequis = $requete->typeRequete->documents;
        $documentsValides = $requete->requeteDocuments->where('est_valide', true);
        
        $tousDocumentsValides = $documentsRequis->every(function ($documentRequis) use ($documentsValides) {
            return $documentsValides->contains('document_id', $documentRequis->id);
        });

        return response()->json([
            'success' => true,
            'tous_documents_valides' => $tousDocumentsValides,
            'message' => 'Validation des documents mise à jour avec succès.'
        ]);
    }

    public function historique(Request $request)
    {
        $user = Auth::user();
        
        // Filtres
        $statut = $request->get('statut', 'all');
        $search = $request->get('search', '');
        $date_debut = $request->get('date_debut', '');
        $date_fin = $request->get('date_fin', '');
        
        // Query de base - requêtes traitées par le secrétaire connecté
        $query = Requete::where('secretaire_id', $user->id)
                        ->with(['etudiant', 'typeRequete', 'requeteDocuments.document']);
        
        // Filtrage par statut
        if ($statut !== 'all') {
            $query->where('statut', $statut);
        }
        
        // Recherche
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereHas('etudiant', function($subQ) use ($search) {
                    $subQ->where('nom', 'like', '%' . $search . '%')
                         ->orWhere('identifiant', 'like', '%' . $search . '%');
                })
                ->orWhereHas('typeRequete', function($subQ) use ($search) {
                    $subQ->where('nom', 'like', '%' . $search . '%');
                });
            });
        }
        
        // Filtrage par date
        if ($date_debut) {
            $query->whereRaw("date(created_at) >= ?", [$date_debut]);
        }
        if ($date_fin) {
            $query->whereRaw("date(created_at) <= ?", [$date_fin]);
        }
        
        $requetes = $query->orderBy('date_traitement', 'desc')
                          ->paginate(15);
        
        // Statistiques personnelles
        $statsPersonnelles = [
            'total_traitees' => Requete::where('secretaire_id', $user->id)->count(),
            'validees' => Requete::where('secretaire_id', $user->id)->where('statut', 'validee')->count(),
            'rejetees' => Requete::where('secretaire_id', $user->id)->where('statut', 'rejetee')->count(),
            'terminees' => Requete::where('secretaire_id', $user->id)->where('statut', 'terminee')->count(),
            'ce_mois' => Requete::where('secretaire_id', $user->id)
                               ->whereNotNull('date_traitement')
                               ->whereRaw("strftime('%m', date_traitement) = ?", [sprintf('%02d', Carbon::now()->month)])
                               ->count(),
        ];
        
        return inertia('Secretaire/Historique', [
            'requetes' => $requetes,
            'statsPersonnelles' => $statsPersonnelles,
            'filters' => [
                'statut' => $statut,
                'search' => $search,
                'date_debut' => $date_debut,
                'date_fin' => $date_fin
            ]
        ]);
    }
}