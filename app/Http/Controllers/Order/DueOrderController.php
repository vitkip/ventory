<?php

namespace App\Http\Controllers\Order;

use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DueOrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'order_date');
        $direction = $request->input('direction', 'desc');
        
        $orders = Order::where('due', '>', '0')
            ->with('customer')
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('invoice_no', 'like', "%{$search}%")
                        ->orWhereHas('customer', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Due/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'details.product']);

        return Inertia::render('Due/Show', [
           'order' => $order
        ]);
    }

    public function edit(Order $order)
    {
        $order->load(['customer', 'details.product']);

        return Inertia::render('Due/Edit', [
            'order' => $order
        ]);
    }

    public function update(Order $order, Request $request)
    {
        $rules = [
            'pay' => 'required|numeric'
        ];

        $validatedData = $request->validate($rules);

        $mainPay = $order->pay;
        $mainDue = $order->due;

        $paidDue = $mainDue - $validatedData['pay'];
        $paidPay = $mainPay + $validatedData['pay'];

        $order->update([
            'due' => $paidDue,
            'pay' => $paidPay
        ]);

        return Inertia::location(route('due.index'));
    }
}
