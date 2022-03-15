<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::namespace('App\Http\Controllers')->group(function() {
    Route::prefix('auth')->group(function() {
        Route::post('login', 'AccountController@login');
        Route::post('customer/register', 'AccountController@register_customer');
        Route::post('staff/register', 'AccountController@register_staff');
        Route::middleware('ensure_token')->group(function() {
            Route::put('update', 'AccountController@update');
            Route::post('logout', 'AccountController@logout');
        });
    });

    Route::prefix('cruise')->group(function() {   
        Route::post('/', 'CruiseController@add')->middleware(['ensure_token', 'ensure_staff']);
        Route::get('/', 'CruiseController@all');
        Route::get('/{id}', 'CruiseController@one')->where('id', '[0-9]+');;
        Route::get('/{search}', 'CruiseController@search');
    });

    Route::prefix('book')->middleware('ensure_token')->group(function() {
        Route::get('/', 'BookingController@all');
        Route::get('/{id}', 'BookingController@one');
        Route::delete('/{id}', 'BookingController@delete');
        Route::post('/{cruise_id}', 'BookingController@book');
    });
});