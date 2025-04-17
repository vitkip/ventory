<?php

namespace App\Http\Controllers\Quotation;

use App\Enums\QuotationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Quotation\StoreQuotationRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\QuotationDetails;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'date');
        $direction = $request->input('direction', 'desc');
        
        $quotations = Quotation::with(['customer'])
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('reference', 'like', "%{$search}%")
                        ->orWhereHas('customer', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Quotations/Index', [
            'quotations' => $quotations,
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
        // สำหรับ Inertia เราไม่จำเป็นต้องใช้ Cart::instance('quotation') เพื่อเก็บข้อมูลในเซสชั่น
        // เพราะเราสามารถเก็บและจัดการข้อมูลใน React state ได้โดยตรง
        return Inertia::render('Quotations/Create', [
            'products' => Product::with(['category', 'unit'])->get(['id', 'name', 'code', 'quantity', 'selling_price', 'category_id', 'unit_id', 'product_image']),
            'customers' => Customer::all(['id', 'name']),
            'statuses' => array_map(function($status) {
                return [
                    'value' => $status->value,
                    'label' => $status->name
                ];
            }, QuotationStatus::cases())
        ]);
    }

    public function store(StoreQuotationRequest $request)
    {
        DB::transaction(function () use ($request) {
            $quotation = Quotation::create([
                'date' => $request->date,
                'reference' => $request->reference,
                'customer_id' => $request->customer_id,
                'customer_name' => Customer::findOrFail($request->customer_id)->name,
                'tax_percentage' => $request->tax_percentage,
                'discount_percentage' => $request->discount_percentage,
                'shipping_amount' => $request->shipping_amount, 
                'total_amount' => $request->total_amount,
                'status' => $request->status,
                'note' => $request->note,
                'tax_amount' => $request->tax_amount,
                'discount_amount' => $request->discount_amount,
            ]);

            $quotationItems = json_decode($request->quotation_items, true);
            
            foreach ($quotationItems as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                QuotationDetails::create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $product->name,
                    'product_code' => $product->code,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'] * 100, // แปลงเป็น pennies
                    'unit_price' => $item['unit_price'] * 100, // แปลงเป็น pennies
                    'sub_total' => $item['sub_total'] * 100, // แปลงเป็น pennies
                    'product_discount_amount' => isset($item['product_discount_amount']) ? $item['product_discount_amount'] * 100 : 0, // แปลงเป็น pennies
                    'product_discount_type' => isset($item['product_discount_type']) ? $item['product_discount_type'] : 'fixed',
                    'product_tax_amount' => isset($item['product_tax_amount']) ? $item['product_tax_amount'] * 100 : 0, // แปลงเป็น pennies
                ]);
            }
        });

        return Inertia::location(route('quotations.index'));
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['customer', 'details']);
        
        return Inertia::render('Quotations/Show', [
            'quotation' => $quotation
        ]);
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load(['customer', 'details']);
        
        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'products' => Product::with(['category', 'unit'])->get(['id', 'name', 'code', 'quantity', 'selling_price', 'category_id', 'unit_id', 'product_image']),
            'customers' => Customer::all(['id', 'name']),
            'statuses' => array_map(function($status) {
                return [
                    'value' => $status->value,
                    'label' => $status->name
                ];
            }, QuotationStatus::cases())
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        DB::transaction(function () use ($request, $quotation) {
            $quotation->update([
                'date' => $request->date,
                'reference' => $request->reference,
                'customer_id' => $request->customer_id,
                'customer_name' => Customer::findOrFail($request->customer_id)->name,
                'tax_percentage' => $request->tax_percentage,
                'discount_percentage' => $request->discount_percentage,
                'shipping_amount' => $request->shipping_amount,
                'total_amount' => $request->total_amount,
                'status' => $request->status,
                'note' => $request->note,
                'tax_amount' => $request->tax_amount,
                'discount_amount' => $request->discount_amount,
            ]);

            // ลบรายการเดิม
            QuotationDetails::where('quotation_id', $quotation->id)->delete();
            
            // เพิ่มรายการใหม่
            $quotationItems = json_decode($request->quotation_items, true);
            
            foreach ($quotationItems as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                QuotationDetails::create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $product->name,
                    'product_code' => $product->code,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'] * 100, // แปลงเป็น pennies
                    'unit_price' => $item['unit_price'] * 100, // แปลงเป็น pennies
                    'sub_total' => $item['sub_total'] * 100, // แปลงเป็น pennies
                    'product_discount_amount' => isset($item['product_discount_amount']) ? $item['product_discount_amount'] * 100 : 0, // แปลงเป็น pennies
                    'product_discount_type' => isset($item['product_discount_type']) ? $item['product_discount_type'] : 'fixed',
                    'product_tax_amount' => isset($item['product_tax_amount']) ? $item['product_tax_amount'] * 100 : 0, // แปลงเป็น pennies
                ]);
            }
        });
        
        return Inertia::location(route('quotations.index'));
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();

        return Inertia::location(route('quotations.index'));
    }
}
