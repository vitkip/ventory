import { Head } from '@inertiajs/react'
import { PageProps } from '@/types'
import { useEffect, useRef } from 'react'

interface Product {
  id: number
  name?: string
  code?: string
  category?: {
    id?: number
    name?: string
  }
  unit?: string
}

interface PurchaseItem {
  id?: number
  product_id?: number
  quantity: number
  unit_price: number
  total_price: number
  product?: Product
}

interface Supplier {
  id?: number
  name?: string
  email?: string
  phone?: string
  address?: string
  shop_name?: string
}

interface Purchase {
  id: number
  reference_no?: string
  supplier_id?: number
  purchase_date?: string
  total_amount?: number
  paid_amount?: number
  due_amount?: number
  subtotal?: number
  vat?: number
  purchase_status?: {
    value?: number
    label?: string
  } | number
  payment_status?: {
    value?: number
    label?: string
  } | number
  purchase_note?: string
  created_at?: string
  updated_at?: string
  supplier?: Supplier
  purchase_items?: PurchaseItem[]
}

interface PrintProps extends PageProps {
  purchase: Purchase
  company: {
    name: string
    email: string
    phone: string
    address: string
    logo: string
  }
}

export default function Print({ purchase, company }: PrintProps) {
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      window.print()
    }, 500)
  }, [])

  return (
    <>
      <Head title={`พิมพ์ใบสั่งซื้อ #${purchase.reference_no || 'ใหม่'}`} />
      
      <div className="print:hidden p-4 text-right">
        <button 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => window.print()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
            <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"></path>
          </svg>
          พิมพ์
        </button>
      </div>
      
      <div className="p-4" ref={printRef}>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg print:shadow-none print:border-none">
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">ใบสั่งซื้อ #{purchase.reference_no || 'ใหม่'}</h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <div className="text-xl font-semibold mb-2">ใบสั่งซื้อ</div>
                  <div className="text-gray-500 dark:text-gray-400">เลขที่: {purchase.reference_no || '-'}</div>
                  <div className="text-gray-500 dark:text-gray-400">วันที่: {purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString('th-TH') : '-'}</div>
                </div>
              </div>
              <div className="text-right">
                {company && company.logo && (
                  <img src={company.logo} alt={company.name} className="mb-2 ml-auto" style={{ maxHeight: '70px' }} />
                )}
                <h3 className="text-xl font-semibold mb-1">{company?.name || 'บริษัท'}</h3>
                {company && (
                  <>
                    {company.address && <div className="text-gray-700 dark:text-gray-300">{company.address}</div>}
                    {company.phone && <div className="text-gray-700 dark:text-gray-300">โทร: {company.phone}</div>}
                    {company.email && <div className="text-gray-700 dark:text-gray-300">อีเมล: {company.email}</div>}
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">ข้อมูลซัพพลายเออร์</h3>
                {purchase.supplier ? (
                  <>
                    <div className="mb-1">{purchase.supplier.name}</div>
                    {purchase.supplier.shop_name && (
                      <div className="mb-1">{purchase.supplier.shop_name}</div>
                    )}
                    <div className="mb-1">{purchase.supplier.address}</div>
                    <div className="mb-1">โทร: {purchase.supplier.phone}</div>
                    <div className="mb-1">อีเมล: {purchase.supplier.email}</div>
                  </>
                ) : (
                  <div className="mb-1">ไม่มีข้อมูลซัพพลายเออร์</div>
                )}
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold mb-2">สถานะ</h3>
                <div className="mb-1">
                  <span className="font-medium">สถานะการสั่งซื้อ:</span>{' '}
                  {(() => {
                    // ตรวจสอบว่ามี purchase_status ที่เป็น object และมี value หรือไม่
                    const statusValue = typeof purchase.purchase_status === 'object' && purchase.purchase_status !== null 
                      ? purchase.purchase_status.value 
                      : (typeof purchase.purchase_status === 'number' ? purchase.purchase_status : 0)
                    
                    // ดึงค่า label จาก object หรือกำหนดค่า default ตาม value
                    return typeof purchase.purchase_status === 'object' && purchase.purchase_status !== null && purchase.purchase_status.label
                      ? purchase.purchase_status.label
                      : (statusValue === 0 ? 'รออนุมัติ' : 'อนุมัติแล้ว')
                  })()}
                </div>
                <div className="mb-1">
                  <span className="font-medium">สถานะการชำระเงิน:</span>{' '}
                  {(() => {
                    // ตรวจสอบว่ามี payment_status ที่เป็น object และมี value หรือไม่
                    const paymentStatusValue = typeof purchase.payment_status === 'object' && purchase.payment_status !== null 
                      ? purchase.payment_status.value 
                      : (typeof purchase.payment_status === 'number' ? purchase.payment_status : 0)
                    
                    // ดึงค่า label จาก object หรือกำหนดค่า default ตาม value
                    return typeof purchase.payment_status === 'object' && purchase.payment_status !== null && purchase.payment_status.label
                      ? purchase.payment_status.label
                      : (paymentStatusValue === 0 ? 'ยังไม่ชำระ' : (paymentStatusValue === 1 ? 'ชำระบางส่วน' : 'ชำระแล้ว'))
                  })()}
                </div>
                <div className="mb-1">
                  <span className="font-medium">วันที่สร้าง:</span>{' '}
                  {purchase.created_at ? new Date(purchase.created_at).toLocaleDateString('th-TH') : '-'}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[5%]">ลำดับ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">รหัสสินค้า</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[30%]">ชื่อสินค้า</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">จำนวน</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">ราคาต่อหน่วย</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">ราคารวม</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {purchase.purchase_items && purchase.purchase_items.length > 0 ? purchase.purchase_items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.product?.code || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {item.product?.name || '-'}
                        <br />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          หมวดหมู่: {item.product?.category?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                        {item.quantity} {item.product?.unit || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                        ฿{typeof item.unit_price === 'number' ? (item.unit_price / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                        ฿{typeof item.total_price === 'number' ? (item.total_price / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">ไม่พบรายการสินค้า</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">ยอดรวมก่อนภาษี</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                      ฿{typeof purchase.subtotal === 'number' ? (purchase.subtotal / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">ภาษีมูลค่าเพิ่ม (7%)</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                      ฿{typeof purchase.vat === 'number' ? (purchase.vat / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">ยอดรวมทั้งสิ้น</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                      ฿{typeof purchase.total_amount === 'number' ? (purchase.total_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">ชำระแล้ว</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                      ฿{typeof purchase.paid_amount === 'number' ? (purchase.paid_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">ยอดค้างชำระ</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                      ฿{typeof purchase.due_amount === 'number' ? (purchase.due_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>

            {purchase.purchase_note && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold">หมายเหตุ</h4>
                <p className="text-gray-700 dark:text-gray-300">{purchase.purchase_note}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">ลงชื่อผู้สั่งซื้อ</div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">ลงชื่อผู้อนุมัติ</div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">ลงชื่อซัพพลายเออร์</div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">เลขที่อ้างอิง:</span>
                <span>{purchase.reference_no || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">วันที่สั่งซื้อ:</span>
                <span>{purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString('th-TH') : '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            background-color: #fff;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </>
  )
} 