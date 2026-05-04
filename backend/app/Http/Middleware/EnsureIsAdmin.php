<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 假設你的 users table 有一個 'role' 欄位
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized.'], 403);
    }
}