<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use \Str;

class UsersController extends Controller
{
    const FIELDS = ['username', 'password', 'first_name', 'last_name', 'gender', 'mobile_number', 'email', 'address', 'profile_pic'];
    public function register (Request $request) {
        $user = User::where('username', $request->input('username'))->first();

        if ($user != null) {
            return response()->json(['message' => 'Username already exists!']);
        }

        $user = new User;
        foreach (self::FIELDS as $field) {
            $user->$field = $request->$field;
        }
        $user->token = '';

        if ($user->save()) {
            return $user;
        }
    }

    public function update (Request $request) {
        $user = User::where('token', $request->header('token'))->first();

        if ($user == null) {
            return response()->json(['message' => 'User could not be found!']);
        }

        foreach (self::FIELDS as $field) {
            if ($request->$field) {
                $user->$field = $request->$field;
            }
        }

        if ($user->save()) {
            return $user;
        }
    }

    public function login (Request $request) {
        $user = User::where('username', $request->input('username'))->first();

        if ($user == null) {
            return response()->json(['message' => 'User does not exist!']);
        }

        if ($user->password == $request->input('password')) {
            $user->token = Str::random(60);
            if ($user->save()) {
                return response()->json(['token' => $user->token, 'message' => 'User logged in!']);
            }
        }

        return response()->json(['message' => 'Incorrect password!']);
    }

    public function logout (Request $request) {
        $user = User::where('token', $request->header('token'))->first();

        if ($user == null) {
            return response()->json(['message' => 'User could not be found!']);
        }

        $user->token = '';
        if ($user->save()) {
            return response()->json(['message' => 'User logged out!']);
        }
    }
}
