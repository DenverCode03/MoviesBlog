<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     * Permet l'accès aux super admins, directeurs et service scolarité
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Vous devez être connecté pour accéder à cette page.');
        }

        $adminRoles = ['superAdmin', 'directeur', 'scolarite'];
        
        if (!in_array(auth()->user()->role, $adminRoles)) {
            abort(403, 'Accès refusé. Cette page est réservée aux administrateurs.');
        }

        return $next($request);
    }
}