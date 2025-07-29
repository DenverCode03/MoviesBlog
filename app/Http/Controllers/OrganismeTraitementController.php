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

class OrganismeTraitementController extends Controller
{
    public function traitement(Request $request)
    {
        $user = Auth::user();
        
        // Filtres
        $statut = $request->get('statut', 'en_traitement_organisme');
        $priorite = $request->get('priorite', 'all');
        $search = $request->get('search', '');
        $type_requete = $request->get('type_requete', 'all');
        
        // Query de base - requêtes assignées à cet organisme
        $query = Requete::where('organisme_responsable_id', $user->id)
            ->with(['etudiant', 'typeRequete', 'secretaire', 'directeur', 'requeteDocuments.document']);
        
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
                          ->orderBy('date_envoi_organisme', 'asc')
                          ->paginate(15);
        
        // Statistiques pour les filtres
        $stats = [
            'en_traitement' => Requete::where('organisme_responsable_id', $user->id)
                ->where('statut', 'en_traitement_organisme')->count(),
            'traitees' => Requete::where('organisme_responsable_id', $user->id)
                ->where('statut', 'traitee_organisme')->count(),
            'rejetees' => Requete::where('organisme_responsable_id', $user->id)
                ->where('statut', 'rejetee_organisme')->count(),
            'terminees' => Requete::where('organisme_responsable_id', $user->id)
                ->where('statut', 'terminee')->count(),
            'urgentes' => Requete::where('organisme_responsable_id', $user->id)
                ->where('priorite', 'urgente')
                ->whereIn('statut', ['en_traitement_organisme'])->count(),
        ];
        
        // Types de requêtes pour le filtre (seulement ceux dont cet organisme est responsable)
        $typesRequetes = TypeRequete::where('organisme_responsable_id', $user->id)
            ->where('est_actif', true)
            ->orderBy('nom')
            ->get();
        
        return inertia('OrgTraitement/Traitement', [
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
        // Vérifier que cette requête est assignée à cet organisme
        if ($requete->organisme_responsable_id !== Auth::id()) {
            abort(403, 'Vous n\'avez pas accès à cette requête.');
        }

        $requete->load([
            'etudiant',
            'typeRequete',
            'secretaire',
            'directeur',
            'requeteDocuments.document.validateur'
        ]);
        
        return inertia('OrgTraitement/DetailRequete', [
            'requete' => $requete
        ]);
    }

    public function prendre(Requete $requete)
    {
        // Vérifier que cette requête est assignée à cet organisme
        if ($requete->organisme_responsable_id !== Auth::id()) {
            return back()->with('error', 'Vous n\'avez pas accès à cette requête.');
        }

        // Vérifier que la requête est en traitement organisme
        if ($requete->statut !== 'en_traitement_organisme') {
            return back()->with('error', 'Cette requête ne peut plus être prise en charge.');
        }
        
        $requete->update([
            'statut' => 'en_cours_organisme',
            'date_debut_traitement_organisme' => Carbon::now()
        ]);
        
        return back()->with('success', 'Requête prise en charge avec succès.');
    }

    public function traiter(Request $request, Requete $requete)
    {
        // Vérifier que cette requête est assignée à cet organisme
        if ($requete->organisme_responsable_id !== Auth::id()) {
            return back()->with('error', 'Vous n\'avez pas accès à cette requête.');
        }

        $validator = Validator::make($request->all(), [
            'commentaire_organisme' => 'nullable|string|max:1000',
            'document_resultat' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Vérifier que la requête est en cours de traitement par l'organisme
        if (!in_array($requete->statut, ['en_traitement_organisme', 'en_cours_organisme'])) {
            return back()->with('error', 'Cette requête ne peut plus être traitée.');
        }

        $updateData = [
            'statut' => 'traitee_organisme',
            'date_fin_traitement_organisme' => Carbon::now(),
            'commentaire_organisme' => $request->commentaire_organisme,
        ];

        // Gérer l'upload du document résultat si fourni
        if ($request->hasFile('document_resultat')) {
            $file = $request->file('document_resultat');
            $fileName = time() . '_resultat_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('resultats/' . $requete->id, $fileName, 'public');
            
            $updateData['document_resultat_path'] = $filePath;
            $updateData['document_resultat_nom'] = $file->getClientOriginalName();
        }

        $requete->update($updateData);
        
        return back()->with('success', 'Requête traitée avec succès. Elle est maintenant prête pour finalisation.');
    }

    public function rejeter(Request $request, Requete $requete)
    {
        // Vérifier que cette requête est assignée à cet organisme
        if ($requete->organisme_responsable_id !== Auth::id()) {
            return back()->with('error', 'Vous n\'avez pas accès à cette requête.');
        }

        $validator = Validator::make($request->all(), [
            'motif_rejet_organisme' => 'required|string|max:1000',
            'commentaire_organisme' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Vérifier que la requête peut être rejetée
        if (!in_array($requete->statut, ['en_traitement_organisme', 'en_cours_organisme'])) {
            return back()->with('error', 'Cette requête ne peut plus être rejetée.');
        }
        
        $requete->update([
            'statut' => 'rejetee_organisme',
            'date_fin_traitement_organisme' => Carbon::now(),
            'motif_rejet_organisme' => $request->motif_rejet_organisme,
            'commentaire_organisme' => $request->commentaire_organisme,
        ]);
        
        return back()->with('success', 'Requête rejetée. L\'étudiant et les responsables seront notifiés.');
    }

    public function finaliser(Request $request, Requete $requete)
    {
        // Vérifier que cette requête est assignée à cet organisme
        if ($requete->organisme_responsable_id !== Auth::id()) {
            return back()->with('error', 'Vous n\'avez pas accès à cette requête.');
        }

        $validator = Validator::make($request->all(), [
            'commentaire_organisme' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Vérifier que la requête est traitée
        if ($requete->statut !== 'traitee_organisme') {
            return back()->with('error', 'Cette requête n\'est pas encore traitée.');
        }
        
        $requete->update([
            'statut' => 'terminee',
            'date_finalisation' => Carbon::now(),
            'commentaire_organisme' => $request->commentaire_organisme,
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

    public function downloadResultat(Requete $requete)
    {
        // Vérifier l'accès
        if ($requete->organisme_responsable_id !== Auth::id() && $requete->etudiant_id !== Auth::id()) {
            return back()->with('error', 'Vous n\'avez pas accès à ce document.');
        }

        if (!$requete->document_resultat_path) {
            return back()->with('error', 'Aucun document résultat disponible.');
        }

        $filePath = storage_path('app/public/' . $requete->document_resultat_path);
        
        if (!file_exists($filePath)) {
            return back()->with('error', 'Le fichier résultat n\'existe plus.');
        }
        
        return response()->download($filePath, $requete->document_resultat_nom);
    }

    public function historique(Request $request)
    {
        $user = Auth::user();
        
        // Filtres
        $statut = $request->get('statut', 'all');
        $search = $request->get('search', '');
        $date_debut = $request->get('date_debut', '');
        $date_fin = $request->get('date_fin', '');
        
        // Query de base - requêtes traitées par cet organisme
        $query = Requete::where('organisme_responsable_id', $user->id)
                        ->whereIn('statut', ['traitee_organisme', 'terminee', 'rejetee_organisme'])
                        ->with(['etudiant', 'typeRequete', 'secretaire', 'directeur', 'requeteDocuments.document']);
        
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
            $query->whereRaw("date(date_fin_traitement_organisme) >= ?", [$date_debut]);
        }
        if ($date_fin) {
            $query->whereRaw("date(date_fin_traitement_organisme) <= ?", [$date_fin]);
        }
        
        $requetes = $query->orderBy('date_fin_traitement_organisme', 'desc')
                          ->paginate(15);
        
        // Statistiques personnelles
        $statsPersonnelles = [
            'total_traitees' => Requete::where('organisme_responsable_id', $user->id)
                ->whereIn('statut', ['traitee_organisme', 'terminee', 'rejetee_organisme'])->count(),
            'traitees' => Requete::where('organisme_responsable_id', $user->id)
                ->where('statut', 'traitee_organisme')->count(),
            'terminees' => Requete::where('organisme_responsable_id', $user->id)
                ->where('statut', 'terminee')->count(),
            'rejetees' => Requete::where('organisme_responsable_id', $user->id)
                ->where('statut', 'rejetee_organisme')->count(),
            'ce_mois' => Requete::where('organisme_responsable_id', $user->id)
                ->whereNotNull('date_fin_traitement_organisme')
                ->whereRaw("strftime('%m', date_fin_traitement_organisme) = ?", [sprintf('%02d', Carbon::now()->month)])
                ->count(),
        ];
        
        return inertia('Orgtraitement/Historique', [
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