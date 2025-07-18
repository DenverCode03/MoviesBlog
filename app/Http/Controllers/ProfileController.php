<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request, User $id): RedirectResponse
    {
        // $request->validate([
        //     'password' => ['required', 'current_password'],
        // ]);
        
        return Redirect::back()->with('success', 'Account deleted successfully.');

        $user = $id;
        // dd($user);

        if (Auth::user()->role === 'user') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        // dd(Storage::disk('public')->exists($user->image));

        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::delete($user->image);
        }


        $user->delete();

        if (Auth::user()->role === 'user') {
            return Redirect::to('welcome')->with('success', 'Account deleted successfully.');
        }

        return Redirect::back()->with('success', 'Account deleted successfully.');
    }
}
