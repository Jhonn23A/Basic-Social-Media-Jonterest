<?php
//App/Http/Controllers/BoardController.php
namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BoardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $boards = $user->boards;
    
        return response()->json($boards);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
        ]);

        $board = new Board();
        $board->title = $request->title;
        $board->user_id = Auth::id(); // Asociar automáticamente el usuario autenticado
        $board->save();

        return response()->json($board, 201);
    }

    public function show(Board $board)
    {
        return response()->json($board);
    }

    public function update(Request $request, Board $board)
    {
        $request->validate([
            'title' => 'required|string',
        ]);

        $board->title = $request->title;
        $board->save();

        return response()->json($board);
    }

    public function destroy(Board $board)
    {
        $board->delete();

        return response()->json(null, 204);
    }
    public function savePin(Request $request, $username, $boardname)
    {
        // Obtener el usuario y el tablero basados en los nombres de usuario y tablero
        $user = User::where('username', $username)->first();
        $board = Board::where('user_id', $user->id)->where('title', $boardname)->first();

        // Verificar si el usuario y el tablero existen
        if (!$user || !$board) {
            return response()->json(['message' => 'Usuario o tablero no encontrado'], 404);
        }

        // Guardar el pin en el tablero
        $pin = new Pin();
        $pin->post_id = $request->postId;
        $pin->board_id = $board->id;
        $pin->save();

        return response()->json(['message' => 'Pin guardado exitosamente'], 201);
    }

    public function getPins($boardName)
    {
        $board = Board::with('pins')->where('title', $boardName)->first();
    
        if (!$board) {
            return response()->json(['message' => 'Tablero no encontrado'], 404);
        }
    
        return response()->json($board->pins);
    }

    public function getFirstPin($boardId)
    {
        $board = Board::with('pins')->find($boardId);

        if (!$board || count($board->pins) === 0) {
            return response()->json(['message' => 'No se encontraron pines'], 404);
        }

        return response()->json($board->pins[0]);
    }
    
}