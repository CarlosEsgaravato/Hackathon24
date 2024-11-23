<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'ambiente_id',
        'horario_inicio',
        'horario_fim',
        'statusReserva',
        'status',
        'data'
    ];
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function ambiente()
    {
        return $this->belongsTo(Ambiente::class, 'ambiente_id');
    }
}
