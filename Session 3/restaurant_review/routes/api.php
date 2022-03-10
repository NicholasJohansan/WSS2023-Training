<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\RestaurantsController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\UsersController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::apiResource('restaurants', RestaurantsController::class)->middleware('ensurevalidtoken');
Route::apiResource('reviews', ReviewsController::class)->middleware('ensurevalidtoken');

Route::post('register', [UsersController::class, 'register']);
Route::post('login', [UsersController::class, 'login']);
Route::post('logout', [UsersController::class, 'logout']);
Route::put('users/update', [UsersController::class, 'update']);