<?php

namespace App\Http\Controllers;

use App\Models\Cruise;
use Illuminate\Http\Request;

class CruiseController extends Controller
{
    const FIELDS = ['name', 'size', 'owner', 'capacity', 'built_date'];
    public function add(Request $request) {
        $cruise = new Cruise;
        foreach (self::FIELDS as $field) {
            $cruise->$field = $request->$field;
        }
        if ($cruise->save()) {
            return response()->json(['message' => 'Successfully added cruise'], 200);
        }
    }

    public function all(Request $request) {
        return response()->json(Cruise::all(), 200);
    }

    public function one($id, Request $request) {
        $cruise = Cruise::where('id', $id)->first();
        if ($cruise == null) {
            return response()->json(['message' => 'Cruise not found'], 404);
        }
        return response()->json($cruise, 200);
    }

    public function search($search) {
        $cruises = Cruise::where('name', 'like', '%'.$search.'%')->get();
        if ($cruises->first() == null) {
            return response()->json(['message' => 'Cruise not found'], 404);
        }
        return response()->json($cruises, 200);
    }
}
