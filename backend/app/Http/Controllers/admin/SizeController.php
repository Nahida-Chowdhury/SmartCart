<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SizeController extends Controller
{
    public function index()
    {
        $sizes = Size::orderBy('id', 'ASC')->get();
        return response()->json([
            'status' => 200,
            'data' => $sizes
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:sizes,name'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $size = Size::create([
            'name' => $request->name
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Size created successfully',
            'data' => $size
        ], 200);
    }
}
