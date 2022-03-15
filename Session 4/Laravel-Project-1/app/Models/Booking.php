<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Account;
use App\Models\Cruise;

class Booking extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function account() {
        return $this->belongsTo(Account::class);
    }

    public function cruise() {
        return $this->belongsTo(Cruise::class);
    }
}
