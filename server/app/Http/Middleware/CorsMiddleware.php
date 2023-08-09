<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        $allowedOrigins = [
            'http://localhost:3000', // 允许的前端域名
            // 添加其他允许的域名
        ];
    
        $origin = $request->header('Origin');
    
        if (in_array($origin, $allowedOrigins)) {
            // 设置允许的响应头
            $headers = [
                'Access-Control-Allow-Origin' => $origin,
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With, Authorization',
            ];
    
            if ($request->isMethod('OPTIONS')) {
                // 针对预检请求，返回空响应
                return response()->json('', 200, $headers);
            }
    
            $response = $next($request);
    
            foreach ($headers as $key => $value) {
                $response->header($key, $value);
            }
    
            return $response;
        }
    
        return $next($request);
    }
}
