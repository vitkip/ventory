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
  photo: string | null
  account_holder: string | null
  account_number: string | null
  bank_name: string | null
  created_at: string
  updated_at: string
  quotations: any[]
  orders: any[]
}

interface ShowProps extends PageProps {
  customer: Customer
}

export default function Show({ auth, customer }: ShowProps) {
  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ລູກຄ້າ', url: route('customers.index') },
    { title: customer.name, url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ລາຍລະອຽດ</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{customer.name}</h2>
          </div>
        </div>
      }
    >
      <Head title={`ລາຍລະອຽດລູກຄ້າ - ${customer.name}`} />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ຮູບລູກຄ້າ</h3>
                </div>
                <div className="p-6 flex justify-center">
                  <img 
                    src={customer.photo 
                      ? `/storage/customers/${customer.photo}` 
                      : '/assets/img/demo/user-placeholder.svg'} 
                    alt={customer.name} 
                    className="rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-[250px]"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ข้อมูลลูกค้า</h3>
                  <Link 
                    href={route('customers.edit', customer.id)} 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                  >
                    แก้ไขข้อมูล
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/4">ชื่อ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{customer.name}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">อีเมล</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{customer.email}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">เบอร์โทรศัพท์</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{customer.phone}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">ที่อยู่</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{customer.address}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">ชื่อเจ้าของบัญชี</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{customer.account_holder || '-'}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">เลขที่บัญชี</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{customer.account_number || '-'}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">ธนาคาร</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{customer.bank_name || '-'}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">วันที่สร้าง</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{new Date(customer.created_at).toLocaleDateString('th-TH')}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">วันที่อัปเดตล่าสุด</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{new Date(customer.updated_at).toLocaleDateString('th-TH')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
                  <Link 
                    href={route('customers.index')} 
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium"
                  >
                    กลับไปยังรายการลูกค้า
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {(customer.quotations?.length > 0 || customer.orders?.length > 0) && (
            <div className="grid grid-cols-1 mt-6">
              {customer.quotations?.length > 0 && (
                <div>
                  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ประวัติการเสนอราคา</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                          <tr>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">รหัส</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">วันที่</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">ยอดรวม</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {customer.quotations.map((quotation) => (
                            <tr key={quotation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{quotation.quotation_number}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{new Date(quotation.date).toLocaleDateString('th-TH')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">฿{quotation.total.toLocaleString('th-TH')}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link 
                                  href={route('quotations.show', quotation.id)} 
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  ดู
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {customer.orders?.length > 0 && (
                <div>
                  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ประวัติการสั่งซื้อ</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                          <tr>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">รหัส</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">วันที่</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">ยอดรวม</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {customer.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{order.order_number}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{new Date(order.date).toLocaleDateString('th-TH')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">฿{order.total.toLocaleString('th-TH')}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link 
                                  href={route('orders.show', order.id)} 
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  ดู
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 