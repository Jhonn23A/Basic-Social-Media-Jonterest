<?php
// App/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Mail\VerificationEmail;


class AuthController extends Controller
{
    public function preRegister(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);
    
        // Genera un código de verificación
        $verificationCode = rand(100000, 999999);
    
        // Guarda los datos del usuario y el código de verificación en la sesión
        $request->session()->put('registration_data', [
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'verification_code' => $verificationCode,
        ]);
    
        // Envía el código de verificación por correo electrónico
        Mail::to($request->email)->send(new VerificationEmail($verificationCode));
    
        return response()->json([
            'message' => 'Successfully pre-registered. Please check your email for a verification code.',
            'verification_code' => $verificationCode, // Agrega el código de verificación a la respuesta JSON
        ], 201);
    }
    


    public function verifyCode(Request $request)
    {
        $request->validate([
            'verification_code' => 'required|integer',
        ]);
    
        // Comprueba si el código de verificación es correcto
        if ($request->session()->get('registration_data.verification_code') != $request->verification_code) {
            return response()->json([
                'message' => 'Invalid verification code',
            ], 400);
        }
    
        // Crea el usuario
        $user = new User($request->session()->get('registration_data'));
        $user->save();
    
        // Limpia los datos de registro de la sesión
        $request->session()->forget('registration_data');
    
        // Inicia sesión y genera un token para el usuario
        Auth::login($user);
        $token = $user->createToken('TokenName');
    
        return response()->json([
            'message' => 'Successfully registered.',
            'token' => $token->plainTextToken,
            'name' => $user->name,
            'profile_image' => $user->profile_image // Agrega el campo de imagen de perfil a la respuesta JSON
        ], 201);
    }
    
    

    public function uploadProfileImage(Request $request)
    {
        $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $profileImage = $request->file('profile_image');
        $profileImagePath = $profileImage->store('profile_images', 'public');

        $user = Auth::user();
        $user->profile_image = $profileImagePath;
        $user->save();

        return response()->json([
            'message' => 'Profile image uploaded successfully',
        ], 200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('TokenName');

        return response()->json([
            'message' => 'Successfully logged in',
            'token' => $token->plainTextToken,
            'name' => $user->name,
            'profile_image' => $user->profile_image // Agrega el campo de imagen de perfil a la respuesta JSON
        ]);
    }

    public function logout(Request $request)
    {
       // Revoke the token that was used to authenticate the current request...
       $request->user()->currentAccessToken()->delete();

       return response()->json([
           'message' => 'Successfully logged out'
       ]);
   }
}
