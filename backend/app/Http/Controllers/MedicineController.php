<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function index()
    {
        return response()->json(Medicine::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
        ]);

        $medicine = Medicine::create($validated);

        return response()->json($medicine, 201);
    }

    public function show(string $id)
    {
        $medicine = Medicine::find($id);

        if (! $medicine) {
            return response()->json([
                'message' => 'Medicine not found.',
            ], 404);
        }

        return response()->json($medicine);
    }
}
