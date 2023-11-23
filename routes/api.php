<?php

//routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PinController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;

Route::middleware('web')->group(function () {
    Route::post('/pre-register', [AuthController::class, 'preRegister']);
    Route::post('/verify-code', [AuthController::class, 'verifyCode']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/upload-profile-image', [AuthController::class, 'uploadProfileImage']);
    Route::post('/pins', [PinController::class, 'store']);
    Route::get('/pins/{pin}', [PinController::class, 'show']);
    Route::get('/pins', [PinController::class, 'index']);
    Route::put('/pins/{pin}', [PinController::class, 'update']);
    Route::delete('/pins/{pin}', [PinController::class, 'destroy']);

    Route::get('/boards', [BoardController::class, 'index']);
    Route::post('/boards', [BoardController::class, 'store']);
    Route::get('/boards/{board}', [BoardController::class, 'show']);
    Route::put('/boards/{board}', [BoardController::class, 'update']);
    Route::delete('/boards/{board}', [BoardController::class, 'destroy']);

    Route::post('/pins/{pinId}/boards/{boardId}', [PinController::class, 'saveToBoard']);
    Route::get('/boards/{boardName}/pins', [BoardController::class, 'getPins']);
    Route::get('/boards/{boardId}/firstPin', [BoardController::class, 'getFirstPin']);
    Route::post('/pins/{pin}/like', [LikeController::class, 'likePin']);
    Route::delete('/pins/{pin}/like', [LikeController::class, 'unlikePin']);

    Route::get('/search', [PinController::class, 'search']);

    Route::post('/pins/{pin}/comments', [CommentController::class, 'createComment']);
    Route::delete('/comments/{comment}', [CommentController::class, 'deleteComment']);
    Route::get('/pins/{pin}/comments', [PinController::class, 'getComments']);
});

Route::middleware('auth:sanctum')->get('/user/pins', [PinController::class, 'getUserPins']);

