<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Account;

class EnsureToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Token');
        if ($token == null || $token == '') {
            return response()->json(['message' => 'Missing token'], 401);
        }
        $account = Account::where('auth_token', $token)->first();
        if ($account == null) {
            return response()->json(['message' => 'Invalid token'], 401);
        }
        $request->attributes->add(['account' => $account]);
        return $next($request);
    }
}
