<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'name');
        $direction = $request->input('direction', 'asc');
        
        $suppliers = Supplier::when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('shopname', 'like', "%{$search}%");
                });
            })
            ->when($field !== 'actions', function ($query) use ($field, $direction) {
                return $query->orderBy($field, $direction);
            })
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
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
        return Inertia::render('Suppliers/Create');
    }

    public function store(StoreSupplierRequest $request)
    {
        $supplier = Supplier::create($request->all());

        /**
         * Handle upload an image
         */
        if($request->hasFile('photo')){
            $file = $request->file('photo');
            $filename = hexdec(uniqid()).'.'.$file->getClientOriginalExtension();

            $file->storeAs('suppliers/', $filename, 'public');
            $supplier->update([
                'photo' => $filename
            ]);
        }

        return Inertia::location(route('suppliers.index'));
    }

    public function show(Supplier $supplier)
    {
        $supplier->loadMissing('purchases')->get();

        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier
        ]);
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $supplier->update($request->except('photo'));

        if($request->hasFile('photo')){

            // Delete Old Photo
            if($supplier->photo){
                unlink(public_path('storage/suppliers/') . $supplier->photo);
            }

            // Prepare New Photo
            $file = $request->file('photo');
            $fileName = hexdec(uniqid()).'.'.$file->getClientOriginalExtension();

            // Store an image to Storage
            $file->storeAs('suppliers/', $fileName, 'public');

            // Save DB
            $supplier->update([
                'photo' => $fileName
            ]);
        }

        return Inertia::location(route('suppliers.index'));
    }

    public function destroy(Supplier $supplier)
    {
        if($supplier->photo)
        {
            unlink(public_path('storage/suppliers/') . $supplier->photo);
        }

        $supplier->delete();

        return Inertia::location(route('suppliers.index'));
    }
}
