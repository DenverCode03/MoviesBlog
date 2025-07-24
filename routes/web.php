<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DirecteurController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\OrganismeTraitementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScolariteController;
use App\Http\Controllers\SecretaireController;
use App\Http\Controllers\SuperAdminController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

// Routes spécifiques par rôle
Route::middleware('role.superAdmin')->name('superadmin.')->group(function () {
    // Route::get('/admin/dashboard', [SuperAdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/admin/requetes', [SuperAdminController::class, 'requetes'])->name('requetes');

    // Routes pour la gestion des types de requêtes
    Route::post('/admin/type-requetes', [SuperAdminController::class, 'storeTypeRequete'])->name('type-requetes.store');
    Route::put('/admin/type-requetes/{typeRequete}', [SuperAdminController::class, 'updateTypeRequete'])->name('type-requetes.update');
    Route::delete('/admin/type-requetes/{typeRequete}', [SuperAdminController::class, 'destroyTypeRequete'])->name('type-requetes.destroy');
    Route::patch('/admin/type-requetes/{typeRequete}/toggle-status', [SuperAdminController::class, 'toggleTypeRequeteStatus'])->name('type-requetes.toggle-status');

    // Routes pour la gestion des utilisateurs
    Route::get('/admin/users', [SuperAdminController::class, 'users'])->name('users');
    Route::post('/admin/users', [SuperAdminController::class, 'storeUser'])->name('users.store');
    Route::put('/admin/users/{user}', [SuperAdminController::class, 'updateUser'])->name('users.update');
    Route::delete('/admin/users/{user}', [SuperAdminController::class, 'destroyUser'])->name('users.destroy');
    Route::patch('/admin/users/{user}/reset-password', [SuperAdminController::class, 'resetUserPassword'])->name('users.reset-password');

    // Routes pour la gestion des documents
    Route::get('/admin/documents', [SuperAdminController::class, 'documents'])->name('documents');
    Route::post('/admin/documents', [SuperAdminController::class, 'storeDocument'])->name('documents.store');
    Route::put('/admin/documents/{document}', [SuperAdminController::class, 'updateDocument'])->name('documents.update');
    Route::delete('/admin/documents/{document}', [SuperAdminController::class, 'destroyDocument'])->name('documents.destroy');
    Route::get('/admin/documents/{document}/usage', [SuperAdminController::class, 'showDocumentUsage'])->name('documents.usage');
});

Route::middleware('role.etudiant')->prefix('etudiant')->name('etudiant.')->group(function () {
    Route::get('/mes-requetes', [EtudiantController::class, 'mesRequetes'])->name('mes-requetes');
    Route::get('/requetes/create', [EtudiantController::class, 'create'])->name('requetes.create');
    Route::post('/requetes', [EtudiantController::class, 'store'])->name('requetes.store');
    Route::get('/requetes/{requete}', [EtudiantController::class, 'show'])->name('requetes.show');
    Route::patch('/requetes/{requete}/recuperer', [EtudiantController::class, 'markAsRecupere'])->name('requetes.recuperer');
    Route::delete('/requetes/{requete}', [EtudiantController::class, 'cancel'])->name('requetes.cancel');
    Route::get('/documents/{requeteDocument}/download', [EtudiantController::class, 'downloadDocument'])->name('documents.download');
});

Route::middleware('role.secretaire')->prefix('secretaire')->name('secretaire.')->group(function () {
    Route::get('/traitement', [SecretaireController::class, 'traitement'])->name('traitement');
    Route::get('/historique', [SecretaireController::class, 'historique'])->name('historique');
    Route::get('/requetes/{requete}', [SecretaireController::class, 'show'])->name('requetes.show');
    Route::patch('/requetes/{requete}/prendre', [SecretaireController::class, 'prendre'])->name('requetes.prendre');
    Route::patch('/requetes/{requete}/valider', [SecretaireController::class, 'valider'])->name('requetes.valider');
    Route::patch('/requetes/{requete}/rejeter', [SecretaireController::class, 'rejeter'])->name('requetes.rejeter');
    Route::patch('/requetes/{requete}/finaliser', [SecretaireController::class, 'finaliser'])->name('requetes.finaliser');
    Route::post('/requetes/{requete}/validate-documents', [SecretaireController::class, 'validateDocuments'])->name('requetes.validate-documents');
    Route::get('/documents/{requeteDocument}/download', [SecretaireController::class, 'downloadDocument'])->name('documents.download');
    Route::get('/documents/{requeteDocument}/preview', [SecretaireController::class, 'previewDocument'])->name('documents.preview');
});

Route::middleware('role.directeur')->prefix('directeur')->name('directeur.')->group(function () {
    Route::get('/approbations', [DirecteurController::class, 'approbations'])->name('approbations');
    Route::get('/historique', [DirecteurController::class, 'historique'])->name('historique');
    Route::get('/requetes/{requete}', [DirecteurController::class, 'show'])->name('requetes.show');
    Route::patch('/requetes/{requete}/approuver', [DirecteurController::class, 'approuver'])->name('requetes.approuver');
    Route::patch('/requetes/{requete}/rejeter', [DirecteurController::class, 'rejeter'])->name('requetes.rejeter');
    Route::get('/documents/{requeteDocument}/download', [DirecteurController::class, 'downloadDocument'])->name('documents.download');
    Route::get('/documents/{requeteDocument}/preview', [DirecteurController::class, 'previewDocument'])->name('documents.preview');
});

Route::middleware(['auth', 'role.organisme'])->prefix('orgtraitement')->name('orgtraitement.')->group(function () {
    Route::get('/traitement', [OrganismeTraitementController::class, 'traitement'])->name('traitement');
    Route::get('/historique', [OrganismeTraitementController::class, 'historique'])->name('historique');
    Route::get('/requetes/{requete}', [OrganismeTraitementController::class, 'show'])->name('requetes.show');
    Route::patch('/requetes/{requete}/prendre', [OrganismeTraitementController::class, 'prendre'])->name('requetes.prendre');
    Route::patch('/requetes/{requete}/traiter', [OrganismeTraitementController::class, 'traiter'])->name('requetes.traiter');
    Route::patch('/requetes/{requete}/rejeter', [OrganismeTraitementController::class, 'rejeter'])->name('requetes.rejeter');
    Route::patch('/requetes/{requete}/finaliser', [OrganismeTraitementController::class, 'finaliser'])->name('requetes.finaliser');
    Route::get('/documents/{requeteDocument}/download', [OrganismeTraitementController::class, 'downloadDocument'])->name('documents.download');
    Route::get('/documents/{requeteDocument}/preview', [OrganismeTraitementController::class, 'previewDocument'])->name('documents.preview');
    Route::get('/requetes/{requete}/resultat/download', [OrganismeTraitementController::class, 'downloadResultat'])->name('requetes.resultat.download');
});


Route::middleware('role.scolarite')->prefix('scolarite')->name('scolarite.')->group(function () {
    Route::get('/approbations', [ScolariteController::class, 'approbations'])->name('approbations');
});
