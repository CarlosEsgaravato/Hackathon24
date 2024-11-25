<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservaRequest;
use App\Http\Resources\ReservaResource;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        // Pega o usuário logado a partir do JWT
        $usuarioId = auth()->user()->id;

        // Cria a reserva associando o usuário logado
        $reserva = Reserva::create([
            'usuario_id' => $usuarioId,  // Associa o usuário logado
            'ambiente_id' => $request->ambiente_id,
            'horario_inicio' => $request->horario_inicio,
            'horario_fim' => $request->horario_fim,
            'statusReserva' => 'reservado',
            'status' => 'ativo',
            'data' => $request->data,
        ]);

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
        $reserva->delete();
        return response(null, 204);
    }

    /**
     * Cancel a reservation.
     */
    public function cancelarReserva($id)
    {
        // Encontra a reserva pelo ID
        $reserva = Reserva::findOrFail($id);

        // Verifica se o usuário logado é o proprietário da reserva
        if ($reserva->usuario_id !== auth()->user()->id) {
            return response()->json(['message' => 'Você não pode cancelar esta reserva.'], 403);
        }

        // Altera o status para cancelado
        $reserva->status = 'cancelado';
        $reserva->save();

        return response()->json(['message' => 'Reserva cancelada com sucesso.']);
    }
}
