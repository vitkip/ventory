<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductExportController;
use App\Http\Controllers\Product\ProductImportController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Order\OrderPendingController;
use App\Http\Controllers\Order\OrderCompleteController;
use App\Http\Controllers\Order\DueOrderController;
use App\Http\Controllers\Purchase\PurchaseController;
use App\Http\Controllers\Quotation\QuotationController;
use App\Http\Controllers\Quotation\QuotationSalesController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/confirmpassword', function () {
    return Inertia::render('Auth/ConfirmPassword');
})->name('confirmpassword');

Route::get('/verifyemail', function () {
    return Inertia::render('Auth/VerifyEmail');
})->name('verifyemail');


// ใช้ Middleware สำหรับการตรวจสอบการเข้าสู่ระบบ
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::get('/products/import', [ProductImportController::class, 'create'])->name('products.import.view');
    Route::post('/products/import', [ProductImportController::class, 'store'])->name('products.import.store');
    Route::get('/products/export', [ProductExportController::class, 'create'])->name('products.export.store');
    Route::resource('/products', ProductController::class);

    // Route Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders/store', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/pending', OrderPendingController::class)->name('orders.pending');
    Route::get('/orders/complete', OrderCompleteController::class)->name('orders.complete');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/update/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::get('/orders/details/{order_id}/download', [OrderController::class, 'downloadInvoice'])->name('orders.invoice.download');

    // Route DUES
    Route::get('/due/orders/', [DueOrderController::class, 'index'])->name('due.index');
    Route::get('/due/order/view/{order}', [DueOrderController::class, 'show'])->name('due.show');
    Route::get('/due/order/edit/{order}', [DueOrderController::class, 'edit'])->name('due.edit');
    Route::put('/due/order/update/{order}', [DueOrderController::class, 'update'])->name('due.update');

    // Route Purchases
    Route::get('/purchases/approved', [PurchaseController::class, 'approvedPurchases'])->name('purchases.approvedPurchases');
    Route::get('/purchases/report', [PurchaseController::class, 'dailyPurchaseReport'])->name('purchases.dailyPurchaseReport');
    Route::get('/purchases/report/export', [PurchaseController::class, 'getPurchaseReport'])->name('purchases.getPurchaseReport');
    Route::post('/purchases/report/export', [PurchaseController::class, 'exportPurchaseReport'])->name('purchases.exportPurchaseReport');
    Route::get('/purchases/{purchase}/print', [PurchaseController::class, 'printPurchase'])->name('purchases.print');

    Route::get('/purchases/pending', [PurchaseController::class, 'pendingPurchases'])->name('purchases.pending');
    Route::get('/purchases/complete', [PurchaseController::class, 'completePurchases'])->name('purchases.complete');
    Route::get('/purchases/due', [PurchaseController::class, 'duePurchases'])->name('purchases.due');
    
    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
    Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
    Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchases.store');

    Route::get('/purchases/{purchase}', [PurchaseController::class, 'show'])->name('purchases.show');
    Route::get('/purchases/{purchase}/edit', [PurchaseController::class, 'edit'])->name('purchases.edit');
    Route::put('/purchases/{purchase}/edit', [PurchaseController::class, 'update'])->name('purchases.update');
    Route::delete('/purchases/{purchase}', [PurchaseController::class, 'destroy'])->name('purchases.delete');
    
    // ค้นหาสินค้าสำหรับการสั่งซื้อ
    Route::get('/purchases/search-product', [ProductController::class, 'search'])->name('purchases.search-product');

    // Route Quotation
    Route::resource('/quotations', QuotationController::class);
    Route::get('/quotation-sales', [QuotationSalesController::class, 'index'])->name('quotations.sales');

    // Route Suppliers
    Route::resource('/suppliers', SupplierController::class);

    // Route Customers
    Route::resource('/customers', CustomerController::class);

    // Route Users
    Route::resource('/users', UserController::class); //->except(['show']);

    // Route Categories
    Route::resource('/categories', CategoryController::class);

    // Route Units
    Route::resource('/units', UnitController::class);

    // Route Invoices
    Route::post('/invoice/create', [InvoiceController::class, 'create'])->name('invoice.create');

    // Route Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/settings', [ProfileController::class, 'settings'])->name('profile.settings');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // การออกจากระบบ
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');  // ลบเซสชันและออกจากระบบ

});

// ทำการรวมเส้นทางที่เกี่ยวข้องกับการลงทะเบียนผู้ใช้ใหม่
require __DIR__.'/auth.php';