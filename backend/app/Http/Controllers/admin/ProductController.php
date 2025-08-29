<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    //return all products
    public function index()
    {
        $products = Product::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ]);
    }

    //store product in db
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category_id' => 'required|integer',
            'sku' => 'required|unique:products,sku',
            'is_featured' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $product = new Product();
        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->barcode = $request->barcode;
        $product->save();

        // Create directories if they don't exist
        if (!file_exists(public_path('uploads/products/large'))) {
            mkdir(public_path('uploads/products/large'), 0755, true);
        }
        if (!file_exists(public_path('uploads/products/small'))) {
            mkdir(public_path('uploads/products/small'), 0755, true);
        }

        Log::info('=== PRODUCT STORE PROCESS STARTED ===');
        Log::info('Product ID: ' . $product->id);
        Log::info('Gallery array: ' . json_encode($request->gallery));

        // Check if temp images exist in database
        if (!empty($request->gallery)) {
            $existingTempImages = TempImage::whereIn('id', $request->gallery)->get();
            Log::info('Found temp images in DB: ' . $existingTempImages->count());
            Log::info('Temp image IDs in DB: ' . $existingTempImages->pluck('id')->implode(', '));
        }

        //save product images
        if (!empty($request->gallery)) {
            $imageSet = false; // Track if main image was set

            foreach ($request->gallery as $key => $tempImageId) {
                Log::info("Processing gallery item {$key}: TempImage ID = {$tempImageId}");

                $tempImage = TempImage::find($tempImageId);

                if (!$tempImage) {
                    Log::error("❌ TempImage with ID {$tempImageId} not found in database");
                    continue;
                }

                Log::info("✅ Found TempImage: ID={$tempImageId}, Name={$tempImage->name}");

                $sourcePath = public_path('uploads/temp/' . $tempImage->name);

                // Check if temp file exists on disk
                if (!file_exists($sourcePath)) {
                    Log::error("❌ Temp file not found on disk: {$tempImage->name}");
                    Log::error("❌ Expected path: {$sourcePath}");
                    continue;
                }

                // Check if file is readable
                if (!is_readable($sourcePath)) {
                    Log::error("❌ Temp file not readable: {$tempImage->name}");
                    continue;
                }

                $extArray = explode('.', $tempImage->name);
                $ext = end($extArray);
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

                if (!in_array(strtolower($ext), $allowedExtensions)) {
                    Log::error("❌ Invalid file extension: {$ext}");
                    continue;
                }

                $imageName = $product->id . '-' . time() . '-' . $key . '.' . $ext;

                try {
                    Log::info("🔄 Processing image: {$imageName}");

                    // Process large image
                    $manager = new ImageManager(Driver::class);
                    $img = $manager->read($sourcePath);
                    $img->scaleDown(1200);
                    $largePath = public_path('uploads/products/large/' . $imageName);
                    $img->save($largePath);

                    // Verify large image was created
                    if (file_exists($largePath)) {
                        Log::info("✅ Large image saved: {$largePath}");
                    } else {
                        Log::error("❌ Large image failed to save: {$largePath}");
                        continue;
                    }

                    // Process small image (create new instance)
                    $manager2 = new ImageManager(Driver::class);
                    $img2 = $manager2->read($sourcePath);
                    $img2->coverDown(400, 460);
                    $smallPath = public_path('uploads/products/small/' . $imageName);
                    $img2->save($smallPath);

                    // Verify small image was created
                    if (file_exists($smallPath)) {
                        Log::info("✅ Small image saved: {$smallPath}");
                    } else {
                        Log::error("❌ Small image failed to save: {$smallPath}");
                        continue;
                    }

                    // Set as main image if first successful image
                    if (!$imageSet) {
                        $product->image = $imageName;
                        $product->save();
                        $imageSet = true;
                        Log::info("🎯 Set as main image: {$imageName}");
                    }
                } catch (\Exception $e) {
                    Log::error('❌ Image processing error: ' . $e->getMessage());
                    Log::error('❌ Error details: ' . $e->getFile() . ':' . $e->getLine());
                    continue;
                }
            }

            if (!$imageSet) {
                Log::warning("⚠️ No image was set as the main product image");
            }
        } else {
            Log::info('ℹ️ No gallery images provided');
        }

        Log::info('=== PRODUCT STORE PROCESS COMPLETED ===');

        return response()->json([
            'status' => 200,
            'message' => 'Product has been created successfully!',
            'data' => $product
        ], 200);
    }

    //return a single product
    public function show($id)
    {
        $product = Product::find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found',
                'data' => []
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $product
        ]);
    }

    //update a product
    public function update($id, Request $request)
    {
        $product = Product::find($id);
        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found',
                'data' => []
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category_id' => 'required|integer',
            'sku' => 'required|unique:products,sku,' . $id,
            'is_featured' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->barcode = $request->barcode;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Product has been updated successfully!',
            'data' => $product
        ], 200);
    }

    //delete a single product
    public function destroy($id)
    {
        $product = Product::find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found',
                'data' => []
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Product deleted successfully!',
        ], 200);
    }
}
