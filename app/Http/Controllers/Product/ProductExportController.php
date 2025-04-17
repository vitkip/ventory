<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Exception;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use Inertia\Inertia;

class ProductExportController extends Controller
{
    public function create()
    {
        $products = Product::with(['category', 'unit'])->get();

        $product_array = [
            [
                'Product Name',
                'Category Id',
                'Unit Id',
                'Product Code',
                'Stock',
                'Buying Price',
                'Selling Price',
                'Product Image',
            ]
        ];

        foreach ($products as $product) {
            $product_array[] = [
                'Product Name' => $product->name,
                'Category Id' => $product->category_id,
                'Unit Id' => $product->unit_id,
                'Product Code' => $product->code,
                'Stock' => $product->quantity,
                'Buying Price' => $product->buying_price / 100,
                'Selling Price' => $product->selling_price / 100,
                'Product Image' => $product->product_image,
            ];
        }

        $this->store($product_array);
    }

    public function store($products)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', '4000M');

        try {
            $spreadSheet = new Spreadsheet();
            $spreadSheet->getActiveSheet()->getDefaultColumnDimension()->setWidth(20);
            $spreadSheet->getActiveSheet()->fromArray($products);
            $Excel_writer = new Xls($spreadSheet);
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment;filename="products.xls"');
            header('Cache-Control: max-age=0');
            ob_end_clean();
            $Excel_writer->save('php://output');
            exit();
        } catch (Exception $e) {
            return redirect()->route('products.index')
                ->with('error', 'เกิดข้อผิดพลาดในการส่งออกข้อมูล: ' . $e->getMessage());
        }
    }
}
