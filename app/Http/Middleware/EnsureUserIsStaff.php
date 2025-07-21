<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsStaff
{
    /**
     * Handle an incoming request.
     * Permet l'accès à tout le personnel (tous sauf étudiants)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Vous devez être connecté pour accéder à cette page.');
        }

        $staffRoles = ['superAdmin', 'directeur', 'scolarite', 'secretaire'];
        
        if (!in_array(auth()->user()->role, $staffRoles)) {
            abort(403, 'Accès refusé. Cette page est réservée au personnel de l\'établissement.');
        }

        return $next($request);
    }
}