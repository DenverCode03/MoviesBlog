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

class DirecteurController extends Controller
{
    public function approbations(Request $request)
    {
        $user = Auth::user();

        // Filtres
        $statut = $request->get('statut', 'validee');
        $priorite = $request->get('priorite', 'all');
        $search = $request->get('search', '');
        $type_requete = $request->get('type_requete', 'all');

        // Query de base - requêtes validées en attente d'approbation
        $query = Requete::with(['etudiant', 'typeRequete.organismeResponsable', 'secretaire', 'directeur', 'requeteDocuments.document']);

        // Filtrage par statut (par défaut les requêtes validées)
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
            $query->where(function ($q) use ($search) {
                $q->whereHas('etudiant', function ($subQ) use ($search) {
                    $subQ->where('nom', 'like', '%' . $search . '%')
                        ->orWhere('identifiant', 'like', '%' . $search . '%');
                })
                    ->orWhereHas('typeRequete', function ($subQ) use ($search) {
                        $subQ->where('nom', 'like', '%' . $search . '%');
                    });
            });
        }

        // $requetes = $query->orderByRaw("CASE priorite WHEN 'urgente' THEN 1 WHEN 'haute' THEN 2 WHEN 'normale' THEN 3 WHEN 'basse' THEN 4 ELSE 5 END")
        //     // ->orderBy('date_traitement', 'asc')
        //     ->paginate(15);

        $requetes = Requete::where('statut', 'en_cours')->with(['typeRequete', 'etudiant', 'requeteDocuments'])->orderBy('updated_at', 'asc')->paginate(10);

        // Statistiques pour les filtres
        $stats = [
            'validees' => Requete::where('statut', 'en_cours')->count(),
            'approuvees' => Requete::where('statut', 'approuvee')->count(),
            'rejetees_directeur' => Requete::where('statut', 'rejetee_directeur')->count(),
            'en_traitement_organisme' => Requete::where('statut', 'en_traitement_organisme')->count(),
            'urgentes' => Requete::where('priorite', 'urgente')->where('statut', 'validee')->count(),
        ];

        // Types de requêtes pour le filtre
        $typesRequetes = TypeRequete::where('est_actif', true)->orderBy('nom')->get();

        return inertia('Directeur/Approbations', [
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
            'typeRequete.organismeResponsable',
            'secretaire',
            'directeur',
            'requeteDocuments.document'
        ]);

        return inertia('Directeur/DetailRequete', [
            'requete' => $requete
        ]);
    }

    public function approuver(Request $request, Requete $requete)
    {
        $validator = Validator::make($request->all(), [
            'commentaire_directeur' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Vérifier que la requête est validée par le secrétaire
        if ($requete->statut !== 'en_cours') {
            return back()->with('error', 'Cette requête n\'est pas encore validée par le secrétaire.');
        }

        // Approuver la requête et l'envoyer à l'organisme responsable
        $requete->update([
            'statut' => 'approuvee',
            'directeur_id' => Auth::id(),
            'date_approbation' => Carbon::now(),
            'commentaire_directeur' => $request->commentaire_directeur,
        ]);

        // Si un organisme responsable est défini, changer le statut pour indiquer l'envoi
        if ($requete->typeRequete->organisme_responsable_id) {
            $requete->update([
                'statut' => 'en_traitement_organisme',
                'organisme_responsable_id' => $requete->typeRequete->organisme_responsable_id,
                'date_envoi_organisme' => Carbon::now(),
            ]);
        }

        return back()->with('success', 'Requête approuvée avec succès. L\'organisme responsable a été notifié.');
    }

    public function rejeter(Request $request, Requete $requete)
    {
        $validator = Validator::make($request->all(), [
            'motif_rejet_directeur' => 'required|string|max:1000',
            'commentaire_directeur' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Vérifier que la requête est validée
        if ($requete->statut !== 'en_cours') {
            return back()->with('error', 'Cette requête n\'est pas validée.');
        }

        $requete->update([
            'statut' => 'rejetee_directeur',
            'directeur_id' => Auth::id(),
            'date_approbation' => Carbon::now(),
            'motif_rejet_directeur' => $request->motif_rejet_directeur,
            'commentaire_directeur' => $request->commentaire_directeur,
        ]);

        return back()->with('success', 'Requête rejetée. L\'étudiant et le secrétaire seront notifiés.');
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

    public function historique(Request $request)
    {
        $user = Auth::user();

        // Filtres
        $statut = $request->get('statut', 'all');
        $search = $request->get('search', '');
        $date_debut = $request->get('date_debut', '');
        $date_fin = $request->get('date_fin', '');

        // Query de base - requêtes traitées par le directeur connecté
        $query = Requete::where('directeur_id', $user->id)
            ->with(['etudiant', 'typeRequete.organismeResponsable', 'secretaire', 'requeteDocuments.document']);

        // Filtrage par statut
        if ($statut !== 'all') {
            $query->where('statut', $statut);
        }

        // Recherche
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('etudiant', function ($subQ) use ($search) {
                    $subQ->where('nom', 'like', '%' . $search . '%')
                        ->orWhere('identifiant', 'like', '%' . $search . '%');
                })
                    ->orWhereHas('typeRequete', function ($subQ) use ($search) {
                        $subQ->where('nom', 'like', '%' . $search . '%');
                    });
            });
        }

        // Filtrage par date
        if ($date_debut) {
            $query->whereRaw("date(date_approbation) >= ?", [$date_debut]);
        }
        if ($date_fin) {
            $query->whereRaw("date(date_approbation) <= ?", [$date_fin]);
        }

        $requetes = $query->orderBy('date_approbation', 'desc')
            ->paginate(15);

        // Statistiques personnelles
        $statsPersonnelles = [
            'total_traitees' => Requete::where('directeur_id', $user->id)->count(),
            'approuvees' => Requete::where('directeur_id', $user->id)->where('statut', 'approuvee')->count(),
            'rejetees' => Requete::where('directeur_id', $user->id)->where('statut', 'rejetee_directeur')->count(),
            'en_traitement' => Requete::where('directeur_id', $user->id)->where('statut', 'en_traitement_organisme')->count(),
            'ce_mois' => Requete::where('directeur_id', $user->id)
                ->whereNotNull('date_approbation')
                ->whereRaw("strftime('%m', date_approbation) = ?", [sprintf('%02d', Carbon::now()->month)])
                ->count(),
        ];

        return inertia('Directeur/Historique', [
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
