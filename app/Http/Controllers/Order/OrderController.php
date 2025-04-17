<?php

namespace App\Http\Controllers\Order;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\OrderStoreRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderDetails;
use App\Models\Product;
use Carbon\Carbon;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'order_date');
        $direction = $request->input('direction', 'desc');
        
        $orders = Order::with(['customer'])
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
        ]);
    }

    public function create()
    {
        Cart::instance('order')
            ->destroy();

        return Inertia::render('Orders/Create', [
            'customers' => Customer::all(['id', 'name']),
            'products' => Product::with(['category', 'unit'])->get(['id', 'name', 'code', 'quantity', 'selling_price', 'category_id', 'unit_id', 'product_image']),
        ]);
    }

    public function store(OrderStoreRequest $request)
    {
        $order = Order::create($request->all());

        // Create Order Details
        if (!empty($request->order_items)) {
            $orderItems = json_decode($request->order_items, true);
            
            foreach ($orderItems as $item) {
                OrderDetails::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unitcost' => $item['unit_price'] * 100, // เก็บในรูปแบบ pennies
                    'total' => $item['sub_total'] * 100, // เก็บในรูปแบบ pennies
                ]);
            }
        }

        return Inertia::location(route('orders.index'));
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'details.product']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function update(Order $order, Request $request)
    {
        // อัปเดตข้อมูลออเดอร์
        $order->update($request->all());
        
        // ถ้ามีข้อมูลรายการสินค้าให้อัปเดต
        if ($request->has('order_items')) {
            $orderItems = json_decode($request->order_items, true);
            
            // ลบรายการสินค้าเดิม
            OrderDetails::where('order_id', $order->id)->delete();
            
            // เพิ่มรายการสินค้าใหม่
            foreach ($orderItems as $item) {
                OrderDetails::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unitcost' => $item['unit_price'] * 100, // เก็บในรูปแบบ pennies
                    'total' => $item['sub_total'] * 100, // เก็บในรูปแบบ pennies
                ]);
            }
        }

        // ถ้าสถานะเป็น "เสร็จสิ้น" ให้ลดจำนวนสินค้าในสต็อก
        if ($request->order_status == OrderStatus::COMPLETE) {
            $products = OrderDetails::where('order_id', $order->id)->get();

            foreach ($products as $product) {
                Product::where('id', $product->product_id)
                    ->update(['quantity' => DB::raw('quantity-' . $product->quantity)]);
            }
        }

        return Inertia::location(route('orders.index'));
    }

    public function destroy(Order $order)
    {
        $order->delete();
        
        return Inertia::location(route('orders.index'));
    }

    public function downloadInvoice($order)
    {
        $order = Order::with(['customer', 'details.product'])
            ->where('id', $order)
            ->first();

        // เพิ่มข้อมูลบริษัทสำหรับการพิมพ์
        $company = [
            'name' => config('app.name', 'Laravel'),
            'email' => 'info@example.com',
            'phone' => '0812345678',
            'address' => '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
            'logo' => asset('images/logo.png'),
        ];

        return Inertia::render('Orders/Print', [
            'order' => $order,
            'company' => $company
        ]);
    }
}
