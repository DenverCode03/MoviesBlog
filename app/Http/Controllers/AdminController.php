<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard () {
        return Inertia::render('admin/Dashboard');
    }

    public function user () {
        $user = User::orderBy('created_at', 'desc')->get();
        return Inertia::render('admin/User');
    }
}
