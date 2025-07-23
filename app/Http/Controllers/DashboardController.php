<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Requete;
use App\Models\TypeRequete;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $dashboardData = [];

        switch ($user->role) {
            case 'etudiant':
                $dashboardData = $this->getEtudiantDashboard($user);
                break;
            case 'secretaire':
            case 'scolarite':
                $dashboardData = $this->getStaffDashboard($user);
                break;
            case 'directeur':
                $dashboardData = $this->getDirecteurDashboard($user);
                break;
            case 'superAdmin':
                $dashboardData = $this->getSuperAdminDashboard($user);
                break;
            default:
                $dashboardData = $this->getBasicDashboard($user);
        }

        return inertia('Dashboard', $dashboardData);
    }

    private function getEtudiantDashboard($user)
    {
        // Statistiques des requêtes de l'étudiant
        $mesRequetes = Requete::where('etudiant_id', $user->id);
        
        $stats = [
            'total' => $mesRequetes->count(),
            'en_attente' => $mesRequetes->where('statut', 'en_attente')->count(),
            'en_cours' => $mesRequetes->where('statut', 'en_cours')->count(),
            'validees' => $mesRequetes->where('statut', 'validee')->count(),
            'terminees' => $mesRequetes->where('statut', 'terminee')->count(),
            'rejetees' => $mesRequetes->where('statut', 'rejetee')->count(),
            'recuperees' => $mesRequetes->where('statut', 'recuperee')->count(),
        ];

        // Requêtes récentes
        $requetesRecentes = Requete::where('etudiant_id', $user->id)
            ->with(['typeRequete'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Requêtes urgentes (date limite proche)
        $requetesUrgentes = Requete::where('etudiant_id', $user->id)
            ->whereIn('statut', ['en_attente', 'en_cours'])
            ->where('date_limite', '<=', Carbon::now()->addDays(3))
            ->with(['typeRequete'])
            ->orderBy('date_limite', 'asc')
            ->limit(3)
            ->get();

        // Types de requêtes disponibles
        $typesDisponibles = TypeRequete::where('est_actif', true)
            ->withCount('requetes')
            ->orderBy('nom')
            ->limit(6)
            ->get();

        return [
            'userRole' => 'etudiant',
            'stats' => $stats,
            'requetesRecentes' => $requetesRecentes,
            'requetesUrgentes' => $requetesUrgentes,
            'typesDisponibles' => $typesDisponibles,
        ];
    }

    private function getStaffDashboard($user)
    {
        // Statistiques des requêtes à traiter
        $requetesQuery = Requete::query();
        
        if ($user->role === 'secretaire') {
            // Les secrétaires voient toutes les requêtes en attente et celles qu'ils traitent
            $requetesQuery->where(function($q) use ($user) {
                $q->where('statut', 'en_attente')
                  ->orWhere('secretaire_id', $user->id);
            });
        }

        $stats = [
            'total' => $requetesQuery->count(),
            'en_attente' => Requete::where('statut', 'en_attente')->count(),
            'en_cours' => Requete::where('statut', 'en_cours')->count(),
            'a_valider' => Requete::where('statut', 'validee')->count(),
            'terminees_aujourd_hui' => Requete::where('statut', 'terminee')
                ->whereRaw("date(date_traitement) = ?", [Carbon::today()->format('Y-m-d')])
                ->count(),
        ];

        // Requêtes prioritaires
        $requetesPrioritaires = Requete::whereIn('statut', ['en_attente', 'en_cours'])
            ->whereIn('priorite', ['haute', 'urgente'])
            ->with(['etudiant', 'typeRequete'])
            ->orderByRaw("CASE priorite WHEN 'urgente' THEN 1 WHEN 'haute' THEN 2 WHEN 'normale' THEN 3 WHEN 'basse' THEN 4 ELSE 5 END")
            ->orderBy('created_at', 'asc')
            ->limit(5)
            ->get();

        // Requêtes récemment traitées
        $requetesTraitees = Requete::where('secretaire_id', $user->id)
            ->whereIn('statut', ['validee', 'terminee'])
            ->with(['etudiant', 'typeRequete'])
            ->orderBy('date_traitement', 'desc')
            ->limit(5)
            ->get();

        // Statistiques par type de requête
        $statsParType = TypeRequete::withCount([
            'requetes as total_requetes',
            'requetes as en_attente' => function($q) {
                $q->where('statut', 'en_attente');
            },
            'requetes as en_cours' => function($q) {
                $q->where('statut', 'en_cours');
            }
        ])
        ->get()
        ->filter(function($type) {
            return $type->total_requetes > 0;
        })
        ->sortByDesc('total_requetes')
        ->take(5)
        ->values();

        return [
            'userRole' => $user->role,
            'stats' => $stats,
            'requetesPrioritaires' => $requetesPrioritaires,
            'requetesTraitees' => $requetesTraitees,
            'statsParType' => $statsParType,
        ];
    }

    private function getDirecteurDashboard($user)
    {
        // Statistiques globales pour le directeur
        $stats = [
            'total_requetes' => Requete::count(),
            'en_attente_validation' => Requete::where('statut', 'validee')->count(),
            'validees_ce_mois' => Requete::where('directeur_id', $user->id)
                ->where('statut', 'terminee')
                ->whereNotNull('date_traitement')
                ->whereRaw("strftime('%m', date_traitement) = ?", [sprintf('%02d', Carbon::now()->month)])
                ->count(),
            'taux_rejet' => $this->calculateRejectionRate(),
        ];

        // Requêtes en attente de validation
        $requetesAValider = Requete::where('statut', 'validee')
            ->with(['etudiant', 'typeRequete', 'secretaire'])
            ->orderBy('date_traitement', 'asc')
            ->limit(5)
            ->get();

        // Performance par secrétaire
        $performanceSecretaires = User::where('role', 'secretaire')
            ->withCount([
                'requetesSecretaire as total_traitees',
                'requetesSecretaire as ce_mois' => function($q) {
                    $q->whereNotNull('date_traitement')
                     ->whereRaw("strftime('%m', date_traitement) = ?", [sprintf('%02d', Carbon::now()->month)]);
                }
            ])
            ->get()
            ->filter(function($user) {
                return $user->total_traitees > 0;
            })
            ->sortByDesc('ce_mois')
            ->take(5)
            ->values();

        // Évolution mensuelle - Compatible SQLite et MySQL
        $evolutionMensuelle = Requete::select(
                DB::raw("CAST(strftime('%m', created_at) AS INTEGER) as mois"),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN statut = "terminee" THEN 1 ELSE 0 END) as terminees')
            )
            ->whereRaw("strftime('%Y', created_at) = ?", [Carbon::now()->year])
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        return [
            'userRole' => 'directeur',
            'stats' => $stats,
            'requetesAValider' => $requetesAValider,
            'performanceSecretaires' => $performanceSecretaires,
            'evolutionMensuelle' => $evolutionMensuelle,
        ];
    }

    private function getSuperAdminDashboard($user)
    {
        // Statistiques globales du système
        $stats = [
            'total_utilisateurs' => User::count(),
            'total_requetes' => Requete::count(),
            'total_types' => TypeRequete::count(),
            'total_documents' => Document::count(),
            'requetes_ce_mois' => Requete::whereRaw("strftime('%m', created_at) = ?", [sprintf('%02d', Carbon::now()->month)])->count(),
            'utilisateurs_actifs' => User::whereNotNull('email_verified_at')->count(),
        ];

        // Répartition des utilisateurs par rôle
        $repartitionUtilisateurs = User::select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->get()
            ->pluck('total', 'role');

        // Statistiques des requêtes par statut
        $repartitionRequetes = Requete::select('statut', DB::raw('count(*) as total'))
            ->groupBy('statut')
            ->get()
            ->pluck('total', 'statut');

        // Types de requêtes les plus demandés
        $typesPopulaires = TypeRequete::withCount('requetes')
            ->orderBy('requetes_count', 'desc')
            ->limit(5)
            ->get();

        // Activité récente du système
        $activiteRecente = collect([
            // Nouvelles requêtes
            ...Requete::with(['etudiant', 'typeRequete'])
                ->latest()
                ->limit(3)
                ->get()
                ->map(function($requete) {
                    return [
                        'type' => 'nouvelle_requete',
                        'message' => "Nouvelle requête: {$requete->typeRequete->nom}",
                        'details' => "Par {$requete->etudiant->nom}",
                        'date' => $requete->created_at,
                        'icon' => 'document',
                        'color' => 'blue'
                    ];
                }),
            
            // Nouveaux utilisateurs
            ...User::latest()
                ->limit(2)
                ->get()
                ->map(function($user) {
                    return [
                        'type' => 'nouvel_utilisateur',
                        'message' => "Nouvel utilisateur: {$user->nom}",
                        'details' => "Rôle: {$user->role}",
                        'date' => $user->created_at,
                        'icon' => 'user',
                        'color' => 'green'
                    ];
                })
        ])
        ->sortByDesc('date')
        ->take(5)
        ->values();

        // Performance du système (derniers 7 jours)
        $performanceSysteme = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $performanceSysteme[] = [
                'date' => $date->format('Y-m-d'),
                'requetes' => Requete::whereRaw("date(created_at) = ?", [$date->format('Y-m-d')])->count(),
                'utilisateurs' => User::whereRaw("date(created_at) = ?", [$date->format('Y-m-d')])->count(),
            ];
        }

        return [
            'userRole' => 'superAdmin',
            'stats' => $stats,
            'repartitionUtilisateurs' => $repartitionUtilisateurs,
            'repartitionRequetes' => $repartitionRequetes,
            'typesPopulaires' => $typesPopulaires,
            'activiteRecente' => $activiteRecente,
            'performanceSysteme' => $performanceSysteme,
        ];
    }

    private function getBasicDashboard($user)
    {
        return [
            'userRole' => $user->role,
            'stats' => [
                'message' => 'Tableau de bord en cours de configuration pour votre rôle.'
            ]
        ];
    }

    private function calculateRejectionRate()
    {
        $totalRequetes = Requete::count();
        $requetesRejetees = Requete::where('statut', 'rejetee')->count();
        
        return $totalRequetes > 0 ? round(($requetesRejetees / $totalRequetes) * 100, 1) : 0;
    }
}