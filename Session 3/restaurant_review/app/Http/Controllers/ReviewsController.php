<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use \DateTime;

class ReviewsController extends Controller
{
    const FIELDS = ['username', 'review', 'rating', 'restaurant_id', 'user_id'];
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Review::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $review = new Review;
        foreach (self::FIELDS as $field) {
            $review->$field = $request->$field;
        }
        $review->dateposted = DateTime::createFromFormat('d/m/Y', $request->input('dateposted'));

        if ($review->save()) {
            return $review;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Review::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $review = Review::find($id);
        foreach (self::FIELDS as $field) {
            if ($request->$field) {
                $review->$field = $request->$field;
            }
        }
        if ($request->input('dateposted')) {
            $review->dateposted = $request->input('dateposted');
        }

        if ($review->save()) {
            return $review;
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $review = Review::find($id);

        if ($review->delete()) {
            return $review;
        }
    }
}
