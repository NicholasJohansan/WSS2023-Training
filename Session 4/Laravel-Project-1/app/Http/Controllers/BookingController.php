<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Cruise;
use Illuminate\Http\Request;
use \DateTime;

class BookingController extends Controller
{
    const FIELDS = ['price', 'quantity', 'sailing_datetime'];
    public function all(Request $request) {
        $account = $request->get('account');
        return response()->json($account->bookings, 200);
    }

    public function one($id, Request $request) {
        $account = $request->get('account');
        $booking = $account->bookings()->where('id', $id)->first();
        if ($booking == null) {
            return response()->json(['message' => 'Booking not found'], 404);
        }
        return response()->json($booking, 200);
    }

    public function delete($id, Request $request) {
        $account = $request->get('account');
        $booking = $account->bookings()->where('id', $id)->first();
        if ($booking == null) {
            return response()->json(['message' => 'Booking not found'], 404);
        }
        if ($booking->delete()) {
            return response()->json(null, 204);
        }
    }

    public function book($cruise_id, Request $request) {
        if (Cruise::where('id', $cruise_id)->first() == null) {
            return response()->json(['message' => 'Cruise not found'], 404);
        }

        $booking = new Booking;
        foreach (self::FIELDS as $field) {
            $booking->$field = $request->$field;
        }
        $booking->booking_datetime = (new DateTime())->format('Y-m-d H:i:s');
        $booking->account_id = $request->get('account')->id;
        $booking->cruise_id = $cruise_id;

        if ($booking->save()) {
            return response()->json(['message' => 'Successfully placed booking'], 200);
        }
    }
}
