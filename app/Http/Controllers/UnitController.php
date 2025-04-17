<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\Unit\StoreUnitRequest;
use App\Http\Requests\Unit\UpdateUnitRequest;

class UnitController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage') ?: 10;
        $search = $request->input('search');
        $field = $request->input('field') ?: 'name';
        $direction = $request->input('direction') ?: 'asc';

        $units = Unit::query()
            ->when($search, function ($query, $search) {
                $query->search($search);
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Units/Index', [
            'units' => $units,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Units/Create');
    }

    public function show(Unit $unit)
    {
        $unit->loadMissing('products');

        return Inertia::render('Units/Show', [
            'unit' => $unit
        ]);
    }

    public function store(StoreUnitRequest $request)
    {
        Unit::create($request->validated());

        return redirect()
            ->route('units.index')
            ->with('success', 'หน่วยวัดถูกสร้างเรียบร้อยแล้ว!');
    }

    public function edit(Unit $unit)
    {
        return Inertia::render('Units/Edit', [
            'unit' => $unit
        ]);
    }

    public function update(UpdateUnitRequest $request, Unit $unit)
    {
        $unit->update($request->validated());

        return redirect()
            ->route('units.index')
            ->with('success', 'หน่วยวัดถูกอัปเดตเรียบร้อยแล้ว!');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()
            ->route('units.index')
            ->with('success', 'หน่วยวัดถูกลบเรียบร้อยแล้ว!');
    }
}
