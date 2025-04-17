import { FormEvent } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface Order {
  id: number
  invoice_no: string
  customer_id: number
  order_date: string
  total_products: number
  sub_total: number
  vat: number
  total: number
  pay: number
  due: number
  order_status: number
  created_at: string
  updated_at: string
  customer: Customer
}

interface EditProps extends PageProps {
  order: Order
}

export default function Edit({ auth, order }: EditProps) {
  const { data, setData, post, errors, processing } = useForm({
    _method: 'PUT',
    pay: 0
  })

  const maxAmount = order.due / 100

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการค้างชำระ', url: route('due.index') },
    { title: order.invoice_no, url: route('due.show', order.id) },
    { title: 'ชำระเงิน', url: undefined }
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post(route('due.update', order.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">ชำระเงินค้างชำระ</h2>
          </div>
        </div>
      }
    >
      <Head title={`ชำระเงินค้างชำระ: ${order.invoice_no}`} />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ข้อมูลการสั่งซื้อ</h3>
                </div>
                <div className="p-6 space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">เลขที่ใบแจ้งหนี้:</span>
                    <span className="text-gray-900 dark:text-gray-100">{order.invoice_no}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">วันที่สั่งซื้อ:</span>
                    <span className="text-gray-900 dark:text-gray-100">{new Date(order.order_date).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ลูกค้า:</span>
                    <Link href={route('customers.show', order.customer_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {order.customer.name}
                    </Link>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ยอดรวมทั้งสิ้น:</span>
                    <span className="text-gray-900 dark:text-gray-100">฿{(order.total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ชำระแล้ว:</span>
                    <span className="text-gray-900 dark:text-gray-100">฿{(order.pay / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ยอดค้างชำระ:</span>
                    <span className="text-red-600 dark:text-red-400">฿{(order.due / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ชำระเงิน</h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="pay">
                        จำนวนเงินที่ต้องการชำระ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">฿</span>
                        </div>
                        <input
                          id="pay"
                          type="number"
                          className={`block w-full pl-8 pr-12 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.pay ? 'border-red-500' : ''}`}
                          value={data.pay}
                          onChange={(e) => setData('pay', parseFloat(e.target.value))}
                          required
                          min="0.01"
                          max={maxAmount}
                          step="0.01"
                          placeholder={`ยอดค้างชำระทั้งหมด ${maxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท`}
                        />
                        {errors.pay && <p className="mt-2 text-sm text-red-600">{errors.pay}</p>}
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        ระบุจำนวนเงินที่ต้องการชำระ (สูงสุด {maxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท)
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Link 
                        href={route('due.show', order.id)} 
                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                      >
                        ยกเลิก
                      </Link>
                      <button 
                        type="submit" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        disabled={processing || data.pay <= 0 || data.pay > maxAmount}
                      >
                        {processing ? 'กำลังบันทึก...' : 'บันทึกการชำระเงิน'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 