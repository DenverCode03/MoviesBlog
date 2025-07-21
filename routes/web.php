<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

// Routes spécifiques par rôle
Route::middleware('role.superAdmin')->group(function () {
    Route::get('/admin/system', [SystemController::class, 'index']);
});

Route::middleware('role.etudiant')->group(function () {
    Route::get('/mes-requetes', [RequeteController::class, 'mesRequetes']);
    Route::post('/requetes', [RequeteController::class, 'store']);
});

Route::middleware('role.secretaire')->group(function () {
    Route::get('/requetes/traitement', [RequeteController::class, 'traitement']);
    Route::patch('/requetes/{id}/statut', [RequeteController::class, 'updateStatut']);
});

// Routes pour le personnel
Route::middleware('role.staff')->group(function () {
    Route::get('/dashboard/staff', [DashboardController::class, 'staff']);
});

// Routes pour les administrateurs
Route::middleware('role.admin')->group(function () {
    Route::get('/admin/reports', [ReportController::class, 'index']);
    Route::get('/admin/users', [UserController::class, 'index']);
});

// Middleware flexible
Route::middleware('role:directeur,scolarite')->group(function () {
    Route::get('/validation/requetes', [ValidationController::class, 'index']);
});
