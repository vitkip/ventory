<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'name');
        $direction = $request->input('direction', 'asc');
        
        $customers = Customer::when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->when($field !== 'actions', function ($query) use ($field, $direction) {
                return $query->orderBy($field, $direction);
            })
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
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
        return Inertia::render('Customers/Create');
    }

    public function store(StoreCustomerRequest $request)
    {
        $customer = Customer::create($request->all());

        /**
         * Handle upload an image
         */
        if($request->hasFile('photo'))
        {
            $file = $request->file('photo');
            $filename = hexdec(uniqid()).'.'.$file->getClientOriginalExtension();

            $file->storeAs('customers/', $filename, 'public');
            $customer->update([
                'photo' => $filename
            ]);
        }

        return Inertia::location(route('customers.index'));
    }

    public function show(Customer $customer)
    {
        $customer->loadMissing(['quotations', 'orders'])->get();

        return Inertia::render('Customers/Show', [
            'customer' => $customer
        ]);
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Edit', [
            'customer' => $customer
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        //
        $customer->update($request->except('photo'));

        if($request->hasFile('photo')){

            // Delete Old Photo
            if($customer->photo){
                unlink(public_path('storage/customers/') . $customer->photo);
            }

            // Prepare New Photo
            $file = $request->file('photo');
            $fileName = hexdec(uniqid()).'.'.$file->getClientOriginalExtension();

            // Store an image to Storage
            $file->storeAs('customers/', $fileName, 'public');

            // Save DB
            $customer->update([
                'photo' => $fileName
            ]);
        }

        return Inertia::location(route('customers.index'));
    }

    public function destroy(Customer $customer)
    {
        if($customer->photo)
        {
            unlink(public_path('storage/customers/') . $customer->photo);
        }

        $customer->delete();

        return Inertia::location(route('customers.index'));
    }
}
