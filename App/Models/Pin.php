<?php
// App/Models/Pin.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pin extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'media',
        'link',
        'board_id',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'pin_likes');
    }
    

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likeCount()
    {
        return $this->likes()->count();
    }
    public function isLikedByUser($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }

    
}



