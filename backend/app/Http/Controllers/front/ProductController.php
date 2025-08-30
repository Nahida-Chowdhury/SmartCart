<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function getProducts(Request $request)
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->where('status', 1);

        //filter by category
        if (!empty($request->category)) {
            $catArray = explode(',', $request->category);
            $products = $products->whereIn('category_id', $catArray);
        }

        //filter by brand
        if (!empty($request->category)) {
            $brandArray = explode(',', $request->category);
            $products = $products->whereIn('brand_id', $brandArray);
        }

        $products = $products->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ]);
    }
    public function latestProducts()
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->where('status', 1)
            ->limit(8)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ]);
    }

    public function featuredProducts()
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->where('status', 1)
            ->where('is_featured', 'yes')
            ->limit(8)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ]);
    }

    public function getCategories()
    {
        $categories = Category::orderBy('name', 'ASC')
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $categories
        ]);
    }

    public function getbrands()
    {
        $brands = Brand::orderBy('name', 'ASC')
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $brands
        ]);
    }
}
