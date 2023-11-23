<?php

// App/Http/Controllers/LikeController.php
namespace App\Http\Controllers;
use App\Models\Pin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Like;

class LikeController extends Controller
{
    public function likePin(Request $request, Pin $pin)
    {
        $user = $request->user();
        $pin->likes()->attach($user->id);

        return response()->json(['message' => 'Pin liked successfully']);
    }

    public function unlikePin(Request $request, Pin $pin)
    {
        $user = $request->user();
        $pin->likes()->detach($user->id);

        return response()->json(['message' => 'Pin unliked successfully']);
    }
}