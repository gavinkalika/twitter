<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // return view('welcome');
    return response()->json([
        'status' => 'success',
        'message' => 'Web route is working'
    ]);
});
