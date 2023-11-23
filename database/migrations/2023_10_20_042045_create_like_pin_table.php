<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLikePinTable extends Migration
{
    public function up()
    {
        Schema::create('like_pin', function (Blueprint $table) {
            $table->id();
            $table->foreignId('like_id')->constrained()->onDelete('cascade');
            $table->foreignId('pin_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('like_pin');
    }
}