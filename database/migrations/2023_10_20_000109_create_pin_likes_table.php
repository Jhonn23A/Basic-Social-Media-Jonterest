<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePinLikesTable extends Migration
{
    public function up()
    {
        Schema::create('pin_likes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('pin_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('pin_id')->references('id')->on('pins')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pin_likes');
    }
}
