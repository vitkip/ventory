<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;
use Picqer\Barcode\BarcodeGeneratorHTML;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'name');
        $direction = $request->input('direction', 'asc');
        
        $products = Product::with(['category', 'unit'])
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhereHas('category', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('unit', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($field === 'category.name', function ($query) use ($direction) {
                return $query->join('categories', 'products.category_id', '=', 'categories.id')
                    ->orderBy('categories.name', $direction)
                    ->select('products.*');
            }, function ($query) use ($field, $direction) {
                if ($field !== 'actions') {
                    return $query->orderBy($field, $direction);
                }
                return $query;
            })
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $categories = Category::all(['id', 'name']);
        $units = Unit::all(['id', 'name']);

        if ($request->has('category')) {
            $categories = Category::whereSlug($request->get('category'))->get();
        }

        if ($request->has('unit')) {
            $units = Unit::whereSlug($request->get('unit'))->get();
        }

        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->all());

        /**
         * Handle upload image
         */
        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            $filename = hexdec(uniqid()) . '.' . $file->getClientOriginalExtension();

            $file->storeAs('products/', $filename, 'public');
            $product->update([
                'product_image' => $filename
            ]);
        }

        return Inertia::location(route('products.index'));
    }

    public function show(Product $product)
    {
        // Generate a barcode
        $generator = new BarcodeGeneratorHTML();

        $barcode = $generator->getBarcode($product->code, $generator::TYPE_CODE_128);

        return Inertia::render('Products/Show', [
            'product' => $product,
            'barcode' => $barcode,
        ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::all(['id', 'name']),
            'units' => Unit::all(['id', 'name']),
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->input('term') ?? $request->input('search') ?? '';
        
        $products = Product::where('name', 'like', "%{$search}%")
            ->orWhere('code', 'like', "%{$search}%")
            ->with(['category', 'unit'])
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'code' => $product->code,
                    'quantity' => $product->quantity,
                    'unit_price' => $product->buying_price,
                    'image' => $product->product_image
                        ? asset('storage/products/'.$product->product_image)
                        : null,
                ];
            });
        
        // ถ้าเรียกผ่าน API route หรือมีการร้องขอ JSON ให้คืนค่าเป็น JSON ตรง ๆ
        if ($request->is('api/*') || $request->expectsJson() || $request->ajax()) {
            return $products;
        }
        
        // ถ้าเรียกผ่าน Web route ให้ render หน้า Inertia
        return Inertia::render('Purchases/Edit', [
            'products' => $products,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->except('product_image'));

        if ($request->hasFile('product_image')) {

            // Delete Old Photo
            if ($product->product_image) {
                unlink(public_path('storage/products/') . $product->product_image);
            }

            // Prepare New Photo
            $file = $request->file('product_image');
            $fileName = hexdec(uniqid()) . '.' . $file->getClientOriginalExtension();

            // Store an image to Storage
            $file->storeAs('products/', $fileName, 'public');

            // Save DB
            $product->update([
                'product_image' => $fileName
            ]);
        }

        return Inertia::location(route('products.index'));
    }

    public function destroy(Product $product)
    {
        /**
         * Delete photo if exists.
         */
        if ($product->product_image) {
            unlink(public_path('storage/products/') . $product->product_image);
        }

        $product->delete();

        return Inertia::location(route('products.index'));
    }
}