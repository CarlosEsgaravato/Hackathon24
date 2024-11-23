<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AmbienteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this -> id,
            "nome"=> $this -> nome,
            "tipo"=> $this -> tipo,
            "status"=> $this -> status,
            "equipamentos"=> $this -> equipamentos,
            "horario_inicio"=> $this -> horario_inicio,
            "horario_fim" => $this-> horario_fim,
            "localizacao"=> $this -> localizacao,
            "descricao"=> $this -> descricao,
            'created_at' => $this->created_at
        ];
    }
}
