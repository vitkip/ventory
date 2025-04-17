import { Head } from '@inertiajs/react'
import { PageProps } from '@/types'

interface Product {
  id: number
  name: string
  code: string
  category: {
    id: number
    name: string
  }
  unit: {
    id: number
    name: string
    short_code: string
  }
}

interface CartItem {
  id: string
  name: string
  qty: number
  price: number
  weight: number
  options: {
    image: string | null
    product_id: number
    product?: Product
  }
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface InvoiceProps extends PageProps {
  customer: Customer
  carts: CartItem[]
}

export default function Index({ auth, customer, carts }: InvoiceProps) {
  // คำนวณยอดรวม
  const calculateSubTotal = () => {
    return carts.reduce((total, item) => total + (item.price * item.qty), 0)
  }

  const subTotal = calculateSubTotal()
  const vat = subTotal * 0.07
  const total = subTotal + vat
  
  // ฟังก์ชันสำหรับการพิมพ์
  const handlePrint = () => {
    window.print()
  }

  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="max-w-7xl mx-auto print-margin">
      <Head title={`ใบแจ้งหนี้: ${customer.name}`} />

      <div className="flex justify-between items-center mb-4 no-print">
        <button onClick={() => window.history.back()} className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M5 12l14 0"></path>
            <path d="M5 12l6 6"></path>
            <path d="M5 12l6 -6"></path>
          </svg>
          ย้อนกลับ
        </button>
        
        <button onClick={handlePrint} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
            <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"></path>
          </svg>
          พิมพ์ใบแจ้งหนี้
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden print-content">
        <div className="p-6">
          <div className="flex flex-wrap justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">ใบแจ้งหนี้</h1>
              <h2 className="text-lg text-gray-600 dark:text-gray-400">เลขที่: INV-{new Date().getFullYear()}-{String(customer.id).padStart(4, '0')}</h2>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">บริษัท ABC จำกัด</h2>
              <p className="text-gray-600 dark:text-gray-400">123 ถนนสุขุมวิท แขวงคลองเตย</p>
              <p className="text-gray-600 dark:text-gray-400">เขตคลองเตย กรุงเทพฯ 10110</p>
              <p className="text-gray-600 dark:text-gray-400">โทร: 02-123-4567</p>
              <p className="text-gray-600 dark:text-gray-400">อีเมล: info@abccompany.co.th</p>
            </div>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">ลูกค้า</h3>
              <p className="mb-1 text-gray-600 dark:text-gray-400"><span className="font-medium">ชื่อ:</span> {customer.name}</p>
              <p className="mb-1 text-gray-600 dark:text-gray-400"><span className="font-medium">อีเมล:</span> {customer.email}</p>
              <p className="mb-1 text-gray-600 dark:text-gray-400"><span className="font-medium">โทรศัพท์:</span> {customer.phone}</p>
              <p className="mb-1 text-gray-600 dark:text-gray-400"><span className="font-medium">ที่อยู่:</span> {customer.address}</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">รายละเอียด</h3>
              <p className="mb-1 text-gray-600 dark:text-gray-400"><span className="font-medium">วันที่:</span> {today}</p>
              <p className="mb-1 text-gray-600 dark:text-gray-400"><span className="font-medium">เลขประจำตัวผู้เสียภาษี:</span> 0123456789012</p>
              <p className="mb-1 text-gray-600 dark:text-gray-400"><span className="font-medium">เงื่อนไขการชำระเงิน:</span> 30 วัน</p>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ลำดับ</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รหัสสินค้า</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รายการ</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">จำนวน</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคาต่อหน่วย</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {carts.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.options.product?.code || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{item.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">฿{(item.price / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">฿{((item.price * item.qty) / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th colSpan={5} className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">ยอดรวม:</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">฿{(subTotal / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th colSpan={5} className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">ภาษีมูลค่าเพิ่ม (7%):</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">฿{(vat / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th colSpan={5} className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">ยอดรวมทั้งสิ้น:</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">฿{(total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                </tr>
              </tfoot>
            </table>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-3">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">หมายเหตุ</h3>
              <p className="mb-2 text-gray-600 dark:text-gray-400">กรุณาชำระเงินภายในกำหนด 30 วัน นับจากวันที่ออกใบแจ้งหนี้</p>
              <p className="mb-4 text-gray-600 dark:text-gray-400">การชำระเงินสามารถทำได้โดยการโอนเงินเข้าบัญชีบริษัท หรือชำระเป็นเงินสด</p>
              <h4 className="text-base font-medium mb-2 text-gray-900 dark:text-gray-100">รายละเอียดการชำระเงิน</h4>
              <p className="mb-1 text-gray-600 dark:text-gray-400">ธนาคารกสิกรไทย</p>
              <p className="mb-1 text-gray-600 dark:text-gray-400">เลขที่บัญชี: 123-4-56789-0</p>
              <p className="mb-1 text-gray-600 dark:text-gray-400">ชื่อบัญชี: บริษัท ABC จำกัด</p>
            </div>
            <div className="md:col-span-1">
              <div className="text-center">
                <div className="mb-12">
                  <div className="h-16"></div>
                  <p className="border-t border-gray-200 dark:border-gray-700 pt-2 text-gray-600 dark:text-gray-400">ลายเซ็นผู้รับสินค้า</p>
                </div>
                <div>
                  <div className="h-16"></div>
                  <p className="border-t border-gray-200 dark:border-gray-700 pt-2 text-gray-600 dark:text-gray-400">ลายเซ็นผู้มีอำนาจ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>เอกสารนี้ออกโดยระบบคอมพิวเตอร์ ไม่ต้องลงลายมือชื่อ</p>
            <p>ขอบคุณที่ใช้บริการ</p>
          </div>
        </div>
      </div>

      <style>
        {`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-margin {
            margin: 0;
            padding: 0;
          }
          .print-content {
            border: none !important;
            box-shadow: none !important;
          }
          body {
            font-size: 12pt;
          }
        }
      `}
      </style>
    </div>
  )
} 