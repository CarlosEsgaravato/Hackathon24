<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AmbienteRequest;
use App\Http\Resources\AmbienteResource;
use App\Models\Ambiente;
use Illuminate\Http\Request;

class AmbienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Ambiente::all();
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
    public function store(AmbienteRequest $request)
    {
        $ambiente = Ambiente::create($request -> validated());
        return new AmbienteResource($ambiente);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ambiente $ambiente)
    {
        return new AmbienteResource($ambiente);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ambiente $ambiente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AmbienteRequest $request, Ambiente $ambiente)
    {
        $ambiente->update($request->validated());
        return new AmbienteResource($ambiente);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ambiente $ambiente)
    {
        $ambiente -> delete();
        return Response(null, 204);
    }
}
