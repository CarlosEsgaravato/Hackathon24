<?php

use App\Http\Controllers\Api\AmbienteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\UserController;
use App\Models\User;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('/ambientes', AmbienteController::class)->except([
    'create', 'edit'
]);

 
 Route::post('login', [AuthController::class, 'login']);


//   Route::middleware('auth:sanctum')->group(function () 
//   { Route::apiResource('usuario', UserController::class)->except([
//     'create', 'edit'
// ]);;});

Route::apiResource('/reservas', ReservaController::class)->except([
    'create', 'edit'
]);

Route::apiResource('/usuarios', UserController::class)->except([
    'create', 'edit'
]);

Route::middleware('auth:api')->post('/reservas', [ReservaController::class, 'store']);
Route::middleware('auth:api')->delete('/reservas/{id}', [ReservaController::class, 'cancelarReserva']);