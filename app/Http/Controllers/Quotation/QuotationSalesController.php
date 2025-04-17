<?php

namespace App\Http\Controllers\Quotation;

use App\Models\Quotation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class QuotationSalesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'date');
        $direction = $request->input('direction', 'desc');
        
        $quotations = Quotation::with(['customer'])
            ->where('status', '2') // สถานะ 2 คือใบเสนอราคาที่ขายแล้ว (Sold)
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

        return Inertia::render('Quotations/Sales', [
            'quotations' => $quotations,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
            'page_title' => 'ใบเสนอราคาที่ขายแล้ว'
        ]);
    }
}
