<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getUsersCount()
    {
        try {
            $count = User::where('role', 'customer')->count();

            return response()->json([
                'status' => 200,
                'data' => $count
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch users count'
            ], 500);
        }
    }

    public function getOrdersCount()
    {
        try {
            $count = Order::count();
            $revenue = Order::where('payment_status', 'paid')->sum('grand_total');

            return response()->json([
                'status' => 200,
                'data' => $count,
                'revenue' => $revenue
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch orders count'
            ], 500);
        }
    }

    public function getProductsCount()
    {
        try {
            $count = Product::count();

            return response()->json([
                'status' => 200,
                'data' => $count
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch products count'
            ], 500);
        }
    }

    public function getRecentOrders()
    {
        try {
            $orders = Order::with('user')
                ->orderBy('created_at', 'DESC')
                ->limit(10)
                ->get();

            return response()->json([
                'status' => 200,
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch recent orders'
            ], 500);
        }
    }
}
