import { Head, Link } from '@inertiajs/react'
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

interface Product {
  id: number
  name: string
  code: string
}

interface OrderDetail {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unitcost: number
  total: number
  product: Product
}

interface Order {
  id: number
  invoice_no: string
  customer_id: number
  order_date: string
  order_status: {
    value: number
    label: string
  }
  total_products: number
  sub_total: number
  vat: number
  total: number
  payment_type: string
  pay: number
  due: number
  customer: Customer
  details: OrderDetail[]
}

interface ShowProps extends PageProps {
  order: Order
}

export default function Show({ auth, order }: ShowProps) {
  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการสั่งซื้อ', url: route('orders.index') },
    { title: order.invoice_no, url: undefined }
  ]

  // คำนวณราคาสุทธิ
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })
  }

  // ปุ่มในการจัดการคำสั่งซื้อ
  const orderActions = (
    <div className="flex space-x-2">
      <Link
        href={route('orders.invoice.download', order.id)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        target="_blank"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
          <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
          <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"></path>
        </svg>
        พิมพ์ใบสั่งซื้อ
      </Link>
      {order.order_status.value === 0 && (
        <Link
          href={route('orders.edit', order.id)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400 dark:border-yellow-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
            <path d="M16 5l3 3"></path>
          </svg>
          แก้ไขคำสั่งซื้อ
        </Link>
      )}
      {order.order_status.value === 0 && (
        <Link
          href={route('orders.update', order.id)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          method="put"
          as="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M5 12l5 5l10 -10"></path>
          </svg>
          ยืนยันคำสั่งซื้อ
        </Link>
      )}
      <Link
        href={route('orders.index')}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        กลับไปยังรายการคำสั่งซื้อ
      </Link>
    </div>
  )

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">รายละเอียด</div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">คำสั่งซื้อ {order.invoice_no}</h2>
              </div>
              <div>
                {(() => {
                  const orderStatusValue = typeof order.order_status === 'object' 
                    ? order.order_status.value 
                    : order.order_status;
                  
                  let statusInfo = {
                    classes: '',
                    label: ''
                  };
                  
                  if (orderStatusValue === 0) {
                    statusInfo = {
                      classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
                      label: 'รออนุมัติ'
                    };
                  } else if (orderStatusValue === 1) {
                    statusInfo = {
                      classes: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
                      label: 'เสร็จสิ้น'
                    };
                  } else if (orderStatusValue === 2) {
                    statusInfo = {
                      classes: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
                      label: 'ยกเลิก'
                    };
                  }
                  
                  if (typeof order.order_status === 'object' && order.order_status.label) {
                    statusInfo.label = order.order_status.label;
                  }
                  
                  return (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md mr-1 ${statusInfo.classes}`}>
                      {statusInfo.label}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`คำสั่งซื้อ: ${order.invoice_no}`} />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">รายการสินค้า</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">รหัสสินค้า</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ชื่อสินค้า</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ราคา</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">จำนวน</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">รวม</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {order.details.map((detail) => (
                        <tr key={detail.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{detail.product.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <Link href={route('products.show', detail.product_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {detail.product.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">฿{formatPrice(detail.unitcost)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">{detail.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">฿{formatPrice(detail.total)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={4} className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">รวม</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-100">฿{formatPrice(order.sub_total)}</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={4} className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">ภาษีมูลค่าเพิ่ม 7%</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-100">฿{formatPrice(order.vat)}</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={4} className="px-6 py-4 text-right text-sm font-bold uppercase text-gray-900 dark:text-gray-100">ยอดรวมสุทธิ</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100">฿{formatPrice(order.total)}</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={4} className="px-6 py-4 text-right text-sm text-green-600 dark:text-green-400">ชำระแล้ว</td>
                        <td className="px-6 py-4 text-right text-sm text-green-600 dark:text-green-400">฿{formatPrice(order.pay)}</td>
                      </tr>
                      {order.due > 0 && (
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <td colSpan={4} className="px-6 py-4 text-right text-sm text-red-600 dark:text-red-400">ค้างชำระ</td>
                          <td className="px-6 py-4 text-right text-sm text-red-600 dark:text-red-400">฿{formatPrice(order.due)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
                  {orderActions}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg mb-6">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ข้อมูลลูกค้า</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 w-1/2">ชื่อลูกค้า</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <Link href={route('customers.show', order.customer_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                            {order.customer.name}
                          </Link>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">อีเมล</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.customer.email}</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">เบอร์โทรศัพท์</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.customer.phone}</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">ที่อยู่</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.customer.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ข้อมูลคำสั่งซื้อ</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 w-1/2">เลขที่ใบสั่งซื้อ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.invoice_no}</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">วันที่สั่งซื้อ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{new Date(order.order_date).toLocaleDateString('th-TH', { dateStyle: 'full' })}</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">สถานะ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {(() => {
                            const orderStatusValue = typeof order.order_status === 'object' 
                              ? order.order_status.value 
                              : order.order_status;
                            
                            // กำหนดข้อความและสีตามค่าสถานะ
                            let statusInfo = {
                              classes: '',
                              label: ''
                            };
                            
                            if (orderStatusValue === 0) {
                              statusInfo = {
                                classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
                                label: 'รออนุมัติ'
                              };
                            } else if (orderStatusValue === 1) {
                              statusInfo = {
                                classes: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
                                label: 'เสร็จสิ้น'
                              };
                            } else if (orderStatusValue === 2) {
                              statusInfo = {
                                classes: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
                                label: 'ยกเลิก'
                              };
                            }
                            
                            // ใช้ label จาก API ถ้ามี 
                            if (typeof order.order_status === 'object' && order.order_status.label) {
                              statusInfo.label = order.order_status.label;
                            }
                            
                            return (
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${statusInfo.classes}`}>
                                {statusInfo.label}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">ประเภทการชำระเงิน</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.payment_type}</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">จำนวนสินค้า</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.total_products} รายการ</td>
                      </tr>
                    </tbody>
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