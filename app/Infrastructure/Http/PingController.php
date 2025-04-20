<?php

namespace App\Infrastructure\Http;


use Illuminate\Http\JsonResponse;

class PingController 
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'API is running'
        ]);
    }
} 