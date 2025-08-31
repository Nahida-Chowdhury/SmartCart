<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class SettingsController extends Controller
{
    public function changePassword(Request $request)
    {
        // Debug: Check if request is received
        // \Log::info('Change password request received', $request->all());

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:6',
            'confirm_password' => 'required|same:new_password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $user = Auth::user();

            // Debug: Check if user is authenticated
            // \Log::info('Authenticated user', ['user' => $user ? $user->id : null]);

            if (!$user) {
                return response()->json([
                    'status' => 401,
                    'message' => 'User not authenticated'
                ], 401);
            }

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Current password is incorrect'
                ], 401);
            }

            // Update using query builder to avoid save() issues
            $updated = User::where('id', $user->id)->update([
                'password' => Hash::make($request->new_password)
            ]);

            // \Log::info('Password update result', ['updated' => $updated]);

            return response()->json([
                'status' => 200,
                'message' => 'Password changed successfully'
            ], 200);
        } catch (\Exception $e) {
            // \Log::error('Password change error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Failed to change password: ' . $e->getMessage()
            ], 500);
        }
    }
}
