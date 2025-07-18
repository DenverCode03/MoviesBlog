<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // dd($request->all());
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'phone' => ['required', 'numeric', 'unique:'.User::class],
            'address' => ['required', 'string', 'max:255'],
            'role' => ['string', 'max:10'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);


        // 
        // dd($request->role);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time().'.'.$image->getClientOriginalName();
            $image = $image->storeAs('images', $imageName, 'public');

    
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'role' => $request->role ?? 'user',
                'image' => $image ?? null,
                'password' => Hash::make($request->password),
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }

        event(new Registered($user));

        if (Auth::user()){
            return redirect()->route('admin.user')->with('success', 'tout est ok');
        }else{
            Auth::login($user);
        }


        return redirect(route('dashboard', absolute: false))->with('success', 'tout est ok');
    }
}
