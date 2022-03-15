<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;

class Cruise extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function bookings() {
        return $this->hasMany(Booking::class);
    }
}
