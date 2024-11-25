<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject; // Adicionar a importação da interface

class User extends Authenticatable implements JWTSubject // Implementar a interface JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usuario',
        'email',
        'password',
        'funcao'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Obter o identificador único do JWT
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Normalmente, o identificador único do usuário é o ID
    }

    /**
     * Obter as reivindicações personalizadas do JWT
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        // Adiciona o campo 'funcao' para que ele seja incluído no token
        return [
            'role' => $this->funcao, // Aqui você retorna a função do usuário (admin, usuario, etc.)
        ];
    }
}
