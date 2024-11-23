<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservaRequest;
use App\Http\Resources\ReservaResource;
use App\Models\Reserva;
use GuzzleHttp\Psr7\Response;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Reserva::all();
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
    public function store(ReservaRequest $request)
    {
        $reserva =Reserva::create($request -> validated());
        return new ReservaResource($reserva);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reserva $reserva)
    {
        return new ReservaResource($reserva);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reserva $reserva)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ReservaRequest $request, Reserva $reserva)
    {
        $reserva->update($request->validated());
        return new ReservaResource($reserva);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserva $reserva)
    {
        $reserva -> delete();
        return Response(null, 204);
    }
}
