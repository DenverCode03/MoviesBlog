<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuperAdminController;
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
    Route::get('/admin/dashboard', [SuperAdminController::class, 'dashboard'])->name('dashboard');
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
    Route::get('/dashboard', [EtudiantController::class, 'dashboard'])->name('dashboard');
    Route::get('/mes-requetes', [EtudiantController::class, 'mesRequetes']);
    Route::post('/requetes', [EtudiantController::class, 'store']);
});

// Route::middleware('role.secretaire')->group(function () {
//     Route::get('/requetes/traitement', [RequeteController::class, 'traitement']);
//     Route::patch('/requetes/{id}/statut', [RequeteController::class, 'updateStatut']);
// });

// // Routes pour le personnel
// Route::middleware('role.staff')->group(function () {
//     Route::get('/dashboard/staff', [DashboardController::class, 'staff']);
// });

// // Routes pour les administrateurs
// Route::middleware('role.admin')->group(function () {
//     Route::get('/admin/reports', [ReportController::class, 'index']);
//     Route::get('/admin/users', [UserController::class, 'index']);
// });

// // Middleware flexible
// Route::middleware('role:directeur,scolarite')->group(function () {
//     Route::get('/validation/requetes', [ValidationController::class, 'index']);
// });
