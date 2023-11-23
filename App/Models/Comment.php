<?php

// App/Models/Comment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'content',
        'user_id',
    ];

    public function pin()
    {
        return $this->belongsTo(Pin::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}