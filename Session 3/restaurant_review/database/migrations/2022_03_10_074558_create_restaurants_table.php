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
        Schema::create('restaurants', function (Blueprint $table) {
            $table->integer('restaurant_id')->autoIncrement();
            $table->string('restaurant_name', 64);
            $table->string('restaurant_image', 45)->nullable();
            $table->string('description_text', 100);
            $table->string('location', 64);
            $table->integer('rating')->nullable();
            $table->string('opening_hours', 64);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('restaurants');
    }
};
