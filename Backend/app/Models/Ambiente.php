<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ambiente extends Model
{
    use HasFactory;

    protected $fillable = [
        "nome",
        "tipo",
        "status",
        "equipamentos",
        "horario_inicio",
        "horario_fim",
        "localizacao",
        "descricao"
    ];
}
