<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Enregistrement des middlewares de rôles
        $middleware->alias([
            'role.superAdmin' => \App\Http\Middleware\EnsureUserIsSuperAdmin::class,
            'role.directeur' => \App\Http\Middleware\EnsureUserIsDirecteur::class,
            'role.scolarite' => \App\Http\Middleware\EnsureUserIsScolarite::class,
            'role.secretaire' => \App\Http\Middleware\EnsureUserIsSecretaire::class,
            'role.etudiant' => \App\Http\Middleware\EnsureUserIsEtudiant::class,
            'role.staff' => \App\Http\Middleware\EnsureUserIsStaff::class,
            'role.admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'role' => \App\Http\Middleware\EnsureUserHasRole::class,
            'role.organisme' => \App\Http\Middleware\OrganismeTraitementMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
