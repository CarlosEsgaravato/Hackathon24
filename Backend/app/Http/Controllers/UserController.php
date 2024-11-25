<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string|max:255',
            'senha' => 'required|string|min:8',
            'email' => 'required|string|email|max:255',
            'funcao' => 'required|string|in:admin,usuario',
        ]);

        $user = User::create([
            'usuario' => $request->usuario,
            'password' => $request->senha,
            'email' => $request->email,
            'funcao' => $request->funcao,
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return User::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'usuario' => 'sometimes|string|max:255',
            'senha' => 'sometimes|string|min:8',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'funcao' => 'sometimes|string|in:admin,usuario',
        ]);
        $user = User::findOrFail($id);
        if ($request->has('usuario')) {
            $user->usuario = $request->usuario;
        }
        if ($request->has('senha')) {
            $user->password = Hash::make($request->senha);
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('funcao')) {
            $user->funcao = $request->funcao;
        }
        $user->save();
        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Usuário deletado com sucesso'], 204);
    }
}
