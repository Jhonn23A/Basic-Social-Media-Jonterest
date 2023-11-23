<?php

// App/Models/Like.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $table = 'pin_likes';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pin()
    {
        return $this->belongsTo(Pin::class); // Cambia la relación a belongsTo
    }
}