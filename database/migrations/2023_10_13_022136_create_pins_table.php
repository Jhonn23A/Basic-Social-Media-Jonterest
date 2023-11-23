<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePinsTable extends Migration
{
    public function up()
    {
        Schema::create('pins', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->string('media'); // imagen o video
            $table->string('link')->nullable();
            $table->unsignedBigInteger('board_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('board_id')->references('id')->on('boards')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pins');
    }
}