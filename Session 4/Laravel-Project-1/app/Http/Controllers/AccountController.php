<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use \Str;

class AccountController extends Controller
{
    const FIELDS = ['email', 'username', 'password'];
    public function register_customer(Request $request) {
        $account = new Account;
        foreach (self::FIELDS as $field) {
            $account->$field = $request->$field;
        }
        $account->auth_token = '';
        $account->type = 'customer';
        if ($account->save()) {
            return response()->json(['message' => 'Customer account created'], 200);
        }
    }

    public function register_staff(Request $request) {
        $account = new Account;
        foreach (self::FIELDS as $field) {
            $account->$field = $request->$field;
        }
        $account->auth_token = '';
        $account->type = 'staff';
        if ($account->save()) {
            return response()->json(['message' => 'Staff account created'], 200);
        }
    }

    public function login(Request $request) {
        $account = Account::where('email', $request->email)->first();
        if ($account == null) {
            return response()->json(['message' => 'Account not found'], 401);
        }
        if ($account->password != $request->password) {
            return response()->json(['message' => 'Invalid password'], 401);
        }
        $token = Str::random(60);
        $account->auth_token = $token;
        if ($account->save()) {
            return response()->json(['message' => 'Successfully logged in', 'token' => $token], 200);
        }
    }

    public function logout(Request $request) {
        $account = $request->get('account');
        $account->auth_token = '';
        if ($account->save()) {
            return response()->json(['message' => 'Successfully logged out'], 200);
        }
    }

    public function update(Request $request) {
        $account = $request->get('account');
        foreach (self::FIELDS as $field) {
            if ($request->$field != null) {
                $account->$field = $request->$field;
            }
        }
        if ($account->save()) {
            return response()->json(['message' => 'Successfully updated account'], 200);
        }
    }
}
