<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //return all categories
    public function index()
    {
        $categories = Category::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'date' => $categories
        ]);
    }
}
