<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => '書籍教科書'],
            ['name' => '電子產品'],
            ['name' => '家具宿舍用品'],
            ['name' => '衣服服飾'],
            ['name' => '運動用品'],
            ['name' => '生活用品'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
