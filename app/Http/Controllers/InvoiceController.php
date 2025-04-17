<?php

namespace App\Http\Controllers;

use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Models\Customer;
use Gloudemans\Shoppingcart\Facades\Cart;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function create(StoreInvoiceRequest $request, Customer $customer)
    {
        $customer = Customer::query()
            ->where('id', $request->get('customer_id'))
            ->first();

        return Inertia::render('Invoices/Create', [
            'customer' => $customer,
            'cart_items' => json_decode($request->input('cart_items', '[]'), true)
        ]);
    }
}
