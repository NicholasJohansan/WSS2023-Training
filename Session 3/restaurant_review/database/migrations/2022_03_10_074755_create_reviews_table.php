<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->integer('review_id')->autoIncrement();
            $table->string('username', 64);
            $table->text('review')->nullable();
            $table->dateTime('dateposted');
            $table->integer('rating')->nullable();
            $table->integer('restaurant_id');
            $table->foreign('restaurant_id')->references('restaurant_id')->on('restaurants');
            $table->integer('user_id');
            $table->foreign('user_id')->references('user_id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reviews');
    }
};
