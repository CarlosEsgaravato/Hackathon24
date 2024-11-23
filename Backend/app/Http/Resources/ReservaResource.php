<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'usuario' => $this->usuario->usuario,
            'ambiente_id' => $this->ambiente_id,
            'ambiente_nome' => $this->ambiente->nome,
            'horario_inicio' => $this->horario_inicio,
            'horario_fim' => $this->horario_fim,
            'statusReserva' => $this->statusReserva,
            'status' => $this->status,
            'data' => $this->data,
        ];
    }
}
