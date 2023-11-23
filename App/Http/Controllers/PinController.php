<?php

//App/Http/Controllers/PinController.php

namespace App\Http\Controllers;

use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Board;



class PinController extends Controller
{
    public function index()
    {
        $pins = Pin::with('user')->get();
    
        return response()->json($pins);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'media' => 'required|file|max:30720', // 30 MB
            'link' => 'nullable|string',
            'board_id' => 'required|exists:boards,id',
        ]);
        
    
        $mediaPath = $request->file('media')->store('public');
        $mediaUrl = asset('storage/' . basename($mediaPath));
    
        $pin = new Pin();
        $pin->title = $request->title;
        $pin->description = $request->description;
        $pin->media = $mediaUrl;
        $pin->link = $request->link;
        $pin->board_id = $request->board_id;
        $pin->user_id = Auth::id();
        $pin->save();
    
        // Obtén el usuario que está creando el pin
        $user = User::find(Auth::id());
    
        return response()->json([
            'pin' => $pin,
            'user_profile_image' => $user->profile_image,
            'user_name' => $user->name, // Agrega el nombre del usuario a la respuesta JSON
        ], 201);
    }
    
    

    public function show(Pin $pin)
    {
        $pinArray = $pin->toArray();
        $pinArray['like_count'] = $pin->likeCount();
        $pinArray['user_name'] = $pin->user->name; // Añade el nombre del usuario a la respuesta JSON
        $pinArray['user_profile_image'] = $pin->user->profile_image; // Añade la imagen de perfil del usuario a la respuesta JSON
        $pinArray['liked_by_user'] = $pin->isLikedByUser(Auth::id()); 
        return response()->json($pinArray);
    }
    

    public function update(Request $request, Pin $pin)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'media' => 'required|string', // imagen o video
            'link' => 'nullable|string',
            'board_id' => 'required|exists:boards,id', // asegura que el board_id exista en la tabla boards
        ]);

        $pin->title = $request->title;
        $pin->description = $request->description;
        $pin->media = $request->media;
        $pin->link = $request->link;
        $pin->board_id = $request->board_id;
        $pin->save();

        return response()->json($pin);
    }

    public function destroy(Pin $pin)
    {
        $pin->delete();

        return response()->json(null, 204);
    }
 
    public function saveToBoard(Request $request, $pinId, $boardId)
    {
        $pin = Pin::find($pinId);
        $board = Board::find($boardId);

        // Verificar si el pin y el tablero existen
        if (!$pin || !$board) {
            return response()->json(['message' => 'Pin o tablero no encontrado'], 404);
        }

        // Guardar el pin en el tablero
        $pin->board_id = $board->id;
        $pin->save();

        return response()->json(['message' => 'Pin guardado exitosamente'], 201);
    }

    public function getComments($pinId)
    {
        $pin = Pin::findOrFail($pinId);
        $comments = $pin->comments()->with('user')->get(); // Añade 'with('user')' para incluir los datos del usuario
    
        return response()->json($comments);
    }

    public function getUserPins(Request $request)
    {
        $user = $request->user(); // Obtiene el usuario autenticado
        $pins = Pin::where('user_id', $user->id)->get(); // Obtiene los pines del usuario
        return response()->json($pins);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        $pins = Pin::where('title', 'LIKE', "%{$query}%")
            ->orWhereHas('user', function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%");
            })
            ->with('user')
            ->get();

        return response()->json($pins);
    }
    

    
}