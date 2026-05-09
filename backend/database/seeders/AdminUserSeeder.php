<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // 🌟 記得引入你的 User 模型
use Illuminate\Support\Facades\Hash; // 🌟 記得引入密碼加密工具

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@campus.com'], 
            
            [
                'name' => 'adnin',
                'password' => Hash::make('Kellen123!'), 
                'role' => 'admin', 
            ]
        );
    }
}