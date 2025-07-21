<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Vous devez être connecté pour accéder à cette page.');
        }

        $userRole = auth()->user()->role;

        if (!in_array($userRole, $roles)) {
            $rolesString = implode(', ', $roles);
            abort(403, "Accès refusé. Cette page est réservée aux utilisateurs avec les rôles suivants : {$rolesString}.");
        }

        return $next($request);
    }
}