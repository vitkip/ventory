<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

// Import Enum ที่ต้องการใช้
use App\Enums\OrderStatus;

// Import Model ที่ต้องการใช้
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Quotation;
use App\Models\Customer;
use App\Models\Supplier;

class DashboardController extends Controller
{
    public function index()
    {

        // นับจำนวน Order ที่มีสถานะ 'completed'
        $orders = Order::count();
        $completedOrders = Order::where('order_status', OrderStatus::COMPLETE)->count();

        // นับจำนวนสินค้า
        $products = Product::count();

        // นับจำนวน purchase
        $purchases = Purchase::count();
        // นับจำนวน purchase ของวันนี้
        $todayPurchases = Purchase::query()
            ->where('date', today())
            ->get()
            ->count();

        // นับจำนวนหมวดหมู่
        $categories = Category::count();

        // นับจำนวน quotation
        $quotations = Quotation::count();
        // นับจำนวน quotation ของวันนี้
        $todayQuotations = Quotation::query()
            ->where('date', today()->format('Y-m-d'))
            ->get()
            ->count();

        // เพิ่มข้อมูลสำหรับกราฟ
        // นับจำนวน Order ใน 30 วันล่าสุด
        $last30Days = collect(range(29, 0))->map(function ($days) {
            return now()->subDays($days)->format('Y-m-d');
        });

        // นับจำนวน Order ในแต่ละวัน
        $dailyOrders = Order::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereDate('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();

        // นับจำนวน Purchase ในแต่ละวัน
        $dailyPurchases = Purchase::selectRaw('DATE(date) as date, COUNT(*) as count')
            ->whereDate('date', '>=', now()->subDays(30))
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();

        // ดึงจำนวน Order ใน 30 วันล่าสุด
        $orderData = $last30Days->map(function ($date) use ($dailyOrders) {
            return $dailyOrders[$date] ?? 0;
        })->toArray();

        // ดึงจำนวน Purchase ใน 30 วันล่าสุด
        $purchaseData = $last30Days->map(function ($date) use ($dailyPurchases) {
            return $dailyPurchases[$date] ?? 0;
        })->toArray();

        return Inertia::render('Dashboard', [
            'products' => $products,
            'orders' => $orders,
            'completedOrders' => $completedOrders,
            'purchases' => $purchases,
            'todayPurchases' => $todayPurchases,
            'categories' => $categories,
            'quotations' => $quotations,
            'todayQuotations' => $todayQuotations,
            'chartDates' => $last30Days->toArray(),
            'orderData' => $orderData,
            'purchaseData' => $purchaseData,
        ]);
    }
}