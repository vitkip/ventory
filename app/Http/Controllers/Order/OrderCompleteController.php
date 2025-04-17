<?php

namespace App\Http\Controllers\Order;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class OrderCompleteController extends Controller
{
    public function __invoke(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'order_date');
        $direction = $request->input('direction', 'desc');
        
        $orders = Order::query()
            ->where('order_status', OrderStatus::COMPLETE)
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

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
            'page_title' => 'คำสั่งซื้อที่เสร็จสิ้น',
            'is_complete_page' => true
        ]);
    }
}
