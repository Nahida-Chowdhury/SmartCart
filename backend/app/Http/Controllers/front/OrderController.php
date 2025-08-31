<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class OrderController extends Controller
{
    public function saveOrder(Request $request)
    {

        if (!empty($request->cart)) {
            $order = new Order();
            $order->name = $request->name;
            $order->email = $request->email;
            $order->address = $request->address;
            $order->mobile = $request->mobile;
            $order->state = $request->state;
            $order->zip = $request->zip;
            $order->city = $request->city;
            $order->grand_total = $request->grand_total;
            $order->subtotal = $request->subtotal;
            $order->discount = $request->discount;
            $order->shipping = $request->shipping;
            $order->payment_status = $request->payment_status;
            $order->payment_method = $request->payment_method;

            $order->status = $request->status;
            $order->user_id = $request->user()->id;
            $order->save();

            //save order items
            foreach ($request->cart as $item) {
                $orderItem = new OrderItem();
                $orderItem->order_id = $order->id;
                $orderItem->price = $item['qty'] * $item['price'];
                $orderItem->unit_price = $item['price'];
                $orderItem->qty = $item['qty'];
                $orderItem->product_id = $item['product_id'];
                $orderItem->size = $item['size'];
                $orderItem->name = $item['title'];
                $orderItem->save();
            }

            return response()->json([
                'status' => 200,
                'message' => 'You have successfully placed your order',
                'data' => [
                    'id' => $order->id
                ]
            ], 200);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Your cart is empty'
            ], 400);
        }
    }

    public function createPaymentIntent(Request $request)
    {
        try {
            if ($request->amount > 0) {
                Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

                $paymentIntent = PaymentIntent::create([
                    'amount' => $request->amount,
                    'currency' => 'USD',
                    'payment_method_types' => ['card']
                ]);

                $clientSecret = $paymentIntent->client_secret;
                return response()->json([
                    'status' => 200,
                    'clientSecret' => $clientSecret
                ], 200);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'Amount must be greater than 0'
                ], 400);
            }
        } catch (\Exception $e) {
            // Return the error message from the catch block
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
