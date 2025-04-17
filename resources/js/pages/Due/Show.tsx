import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface OrderDetail {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unitcost: number
  total: number
  product: {
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
}

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
  details: OrderDetail[]
}

interface ShowProps extends PageProps {
  order: Order
}

export default function Show({ auth, order }: ShowProps) {
  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการค้างชำระ', url: route('due.index') },
    { title: order.invoice_no, url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">รายละเอียดรายการค้างชำระ</h2>
              </div>
              <div className="flex space-x-2">
                <Link 
                  href={route('orders.invoice.download', order.id)} 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  target="_blank"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                    <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"></path>
                  </svg>
                  พิมพ์ใบเสร็จ
                </Link>

                <Link 
                  href={route('due.edit', order.id)} 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 9m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path>
                    <path d="M14 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                    <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2"></path>
                  </svg>
                  ชำระเงิน
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`รายการค้างชำระ: ${order.invoice_no}`} />

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
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">จำนวนสินค้า:</span>
                    <span className="text-gray-900 dark:text-gray-100">{order.total_products} รายการ</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ราคารวม:</span>
                    <span className="text-gray-900 dark:text-gray-100">฿{(order.sub_total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ภาษี (7%):</span>
                    <span className="text-gray-900 dark:text-gray-100">฿{(order.vat / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
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
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ค้างชำระ:</span>
                    <span className="text-red-600 dark:text-red-400">฿{(order.due / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">สถานะ:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${order.order_status === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'}`}>
                      {order.order_status === 0 ? 'รอดำเนินการ' : 'เสร็จสิ้น'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ข้อมูลลูกค้า</h3>
                </div>
                <div className="p-6 space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ชื่อ:</span>
                    <Link href={route('customers.show', order.customer_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {order.customer.name}
                    </Link>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">อีเมล:</span>
                    <a href={`mailto:${order.customer.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">{order.customer.email}</a>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">เบอร์โทรศัพท์:</span>
                    <span className="text-gray-900 dark:text-gray-100">{order.customer.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ที่อยู่:</span>
                    <span className="text-gray-900 dark:text-gray-100">{order.customer.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-12">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">รายการสินค้า</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1">ลำดับ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">รหัสสินค้า</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ชื่อสินค้า</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">หมวดหมู่</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">หน่วย</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">จำนวน</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ราคา/หน่วย</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">รวม</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {order.details.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.product.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <Link href={route('products.show', item.product_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {item.product.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.product.category.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.product.unit.short_code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">฿{(item.unitcost / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">฿{(item.total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th colSpan={7} className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">ราคารวม</th>
                        <th className="px-6 py-3 text-right text-sm text-gray-900 dark:text-gray-100">฿{(order.sub_total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                      </tr>
                      <tr>
                        <th colSpan={7} className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">ภาษี (7%)</th>
                        <th className="px-6 py-3 text-right text-sm text-gray-900 dark:text-gray-100">฿{(order.vat / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                      </tr>
                      <tr>
                        <th colSpan={7} className="px-6 py-3 text-right text-sm font-bold text-gray-900 dark:text-gray-100">ยอดรวมทั้งสิ้น</th>
                        <th className="px-6 py-3 text-right text-sm font-bold text-gray-900 dark:text-gray-100">฿{(order.total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                      </tr>
                      <tr>
                        <th colSpan={7} className="px-6 py-3 text-right text-sm font-medium text-green-600 dark:text-green-400">ชำระแล้ว</th>
                        <th className="px-6 py-3 text-right text-sm text-green-600 dark:text-green-400">฿{(order.pay / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                      </tr>
                      <tr>
                        <th colSpan={7} className="px-6 py-3 text-right text-sm font-medium text-red-600 dark:text-red-400">ค้างชำระ</th>
                        <th className="px-6 py-3 text-right text-sm text-red-600 dark:text-red-400">฿{(order.due / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 