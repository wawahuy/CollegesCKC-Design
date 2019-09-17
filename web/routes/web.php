<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::prefix('/fb')->group(function (){

    Route::get('login', "FacebookUser@store")->name('fb.login');
    Route::get('login/callback', "FacebookUser@storeCallback")->name('fb.callback');

});

Route::view('/loginfb', 'loginfb');