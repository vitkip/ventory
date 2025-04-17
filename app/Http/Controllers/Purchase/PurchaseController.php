<?php

namespace App\Http\Controllers\Purchase;

use App\Enums\PurchaseStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchase\StorePurchaseRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseDetails;
use App\Models\Supplier;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'date');
        $direction = $request->input('direction', 'desc');
        
        $purchases = Purchase::with(['supplier'])
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('reference_no', 'like', "%{$search}%")
                        ->orWhereHas('supplier', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();
            
        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }

    public function approvedPurchases(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'date');
        $direction = $request->input('direction', 'desc');
        
        $purchases = Purchase::with(['supplier'])
            ->where('status', PurchaseStatus::APPROVED)
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('reference_no', 'like', "%{$search}%")
                        ->orWhereHas('supplier', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Purchases/Approved', [
            'purchases' => $purchases,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }

    public function pendingPurchases(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'date');
        $direction = $request->input('direction', 'desc');
        
        $purchases = Purchase::with(['supplier'])
            ->where('status', PurchaseStatus::PENDING)
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('reference_no', 'like', "%{$search}%")
                        ->orWhereHas('supplier', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }
    
    public function completePurchases(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'date');
        $direction = $request->input('direction', 'desc');
        
        $purchases = Purchase::with(['supplier'])
            ->where('status', PurchaseStatus::APPROVED)
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('reference_no', 'like', "%{$search}%")
                        ->orWhereHas('supplier', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }
    
    public function duePurchases(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'date');
        $direction = $request->input('direction', 'desc');
        
        // ตรงนี้ควรจะมีการกรองเฉพาะรายการที่ค้างชำระ
        // อาจจะต้องตรวจสอบจากฟิลด์ payment_status หรือตามโครงสร้างข้อมูลที่มี
        $purchases = Purchase::with(['supplier'])
            ->where('status', PurchaseStatus::APPROVED)
            // ถ้ามีฟิลด์สถานะการชำระเงิน ให้เพิ่มเงื่อนไขตรงนี้
            // ->where('payment_status', PaymentStatus::UNPAID)
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('reference_no', 'like', "%{$search}%")
                        ->orWhereHas('supplier', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'details.product', 'createdBy', 'updatedBy']);

        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase
        ]);
    }

    public function edit(Purchase $purchase)
    {
        $purchase->load(['supplier', 'details.product']);
        $suppliers = Supplier::select(['id', 'name'])->get();

        return Inertia::render('Purchases/Edit', [
            'purchase' => $purchase,
            'suppliers' => $suppliers
        ]);
    }

    public function create()
    {
        return Inertia::render('Purchases/Create', [
            'suppliers' => Supplier::select(['id', 'name'])->get(),
        ]);
    }

    public function store(StorePurchaseRequest $request)
    {
        $purchase = Purchase::create($request->all());

        /*
         * TODO: Must validate that
         */
        if (! $request->invoiceProducts == null) {
            $pDetails = [];

            foreach ($request->invoiceProducts as $product) {
                $pDetails['purchase_id'] = $purchase['id'];
                $pDetails['product_id'] = $product['product_id'];
                $pDetails['quantity'] = $product['quantity'];
                $pDetails['unitcost'] = $product['unitcost'];
                $pDetails['total'] = $product['total'];
                $pDetails['created_at'] = Carbon::now();

                //PurchaseDetails::insert($pDetails);
                $purchase->details()->insert($pDetails);
            }
        }

        return Inertia::location(route('purchases.index'));
    }

    public function update(Purchase $purchase, Request $request)
    {
        $products = PurchaseDetails::where('purchase_id', $purchase->id)->get();

        foreach ($products as $product) {
            Product::where('id', $product->product_id)
                ->update(['quantity' => DB::raw('quantity+'.$product->quantity)]);
        }

        Purchase::findOrFail($purchase->id)
            ->update([
                //'purchase_status' => 1, // 1 = approved, 0 = pending
                'status' => PurchaseStatus::APPROVED,
                'updated_by' => auth()->user()->id,
            ]);

        return Inertia::location(route('purchases.index'));
    }

    public function destroy(Purchase $purchase)
    {
        $purchase->delete();

        return Inertia::location(route('purchases.index'));
    }

    public function dailyPurchaseReport(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $field = $request->input('field', 'date');
        $direction = $request->input('direction', 'desc');
        
        $purchases = Purchase::with(['supplier'])
            ->where('date', today()->format('Y-m-d'))
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('reference_no', 'like', "%{$search}%")
                        ->orWhereHas('supplier', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($field, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Purchases/DailyReport', [
            'purchases' => $purchases,
            'filters' => [
                'search' => $search,
                'perPage' => (int)$perPage,
                'field' => $field,
                'direction' => $direction,
            ],
        ]);
    }

    public function getPurchaseReport()
    {
        $suppliers = \App\Models\Supplier::orderBy('name')->get();
        
        return Inertia::render('Purchases/Report', [
            'suppliers' => $suppliers
        ]);
    }

    public function exportPurchaseReport(Request $request)
    {
        $rules = [
            'start_date' => 'required|string|date_format:Y-m-d',
            'end_date' => 'required|string|date_format:Y-m-d',
        ];

        $validatedData = $request->validate($rules);

        $sDate = $validatedData['start_date'];
        $eDate = $validatedData['end_date'];

        $purchases = DB::table('purchase_details')
            ->join('products', 'purchase_details.product_id', '=', 'products.id')
            ->join('purchases', 'purchase_details.purchase_id', '=', 'purchases.id')
            ->join('users', 'users.id', '=', 'purchases.created_by')
            ->whereBetween('purchases.date', [$sDate, $eDate])
            ->where('purchases.purchase_status', '1')
            ->select('purchases.purchase_no', 'purchases.date', 'purchases.supplier_id', 'products.code', 'products.name', 'purchase_details.quantity', 'purchase_details.unitcost', 'purchase_details.total', 'users.name as created_by')
            ->get();

        // dd($purchases);

        $purchase_array[] = [
            'Date',
            'No Purchase',
            'Supplier',
            'Product Code',
            'Product',
            'Quantity',
            'Unitcost',
            'Total',
            'Created By'
        ];

        foreach ($purchases as $purchase) {
            $purchase_array[] = [
                'Date' => $purchase->date,
                'No Purchase' => $purchase->purchase_no,
                'Supplier' => $purchase->supplier_id,
                'Product Code' => $purchase->product_code,
                'Product' => $purchase->product_name,
                'Quantity' => $purchase->quantity,
                'Unitcost' => $purchase->unitcost,
                'Total' => $purchase->total,
                'Created By' => $purchase->created_by,
            ];
        }

        $this->exportExcel($purchase_array);
        
        return Inertia::location(route('purchases.getPurchaseReport'));
    }

    public function exportExcel($products)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', '4000M');

        try {
            $spreadSheet = new Spreadsheet();
            $spreadSheet->getActiveSheet()->getDefaultColumnDimension()->setWidth(20);
            $spreadSheet->getActiveSheet()->fromArray($products);
            $Excel_writer = new Xls($spreadSheet);
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment;filename="purchase-report.xls"');
            header('Cache-Control: max-age=0');
            ob_end_clean();
            $Excel_writer->save('php://output');
            exit();
        } catch (Exception $e) {
            return $e;
        }
    }

    public function printPurchase(Purchase $purchase)
    {
        $purchase->load(['supplier', 'details.product']);

        // เพิ่มข้อมูลบริษัทสำหรับการพิมพ์
        $company = [
            'name' => config('app.name', 'Laravel'),
            'email' => 'info@example.com',
            'phone' => '0812345678',
            'address' => '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
            'logo' => asset('images/logo.png'),
        ];

        return Inertia::render('Purchases/Print', [
            'purchase' => $purchase,
            'company' => $company
        ]);
    }
}
