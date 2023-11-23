<?php
// App/Http/Controllers/CommentController.php
namespace App\Http\Controllers;
use App\Models\Comment;
use App\Models\Pin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class CommentController extends Controller
{
    public function createComment(Request $request, $pinId)
    {
        $request->validate([
            'content' => 'required|string',
        ]);
    
        $user = $request->user();
        $comment = new Comment([
            'content' => $request->input('content'),
            'user_id' => $user->id,
        ]);
    
        $pin = Pin::findOrFail($pinId);
        $pin->comments()->save($comment);
    
        return response()->json([
            'message' => 'Comment created successfully',
            'user_name' => $user->name, // Añade el nombre del usuario a la respuesta JSON
            'user_profile_image' => $user->profile_image, // Añade la imagen de perfil del usuario a la respuesta JSON
        ]);
    }
    

    public function deleteComment(Request $request, Comment $comment)
    {
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}