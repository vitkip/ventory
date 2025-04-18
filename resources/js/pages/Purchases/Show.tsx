import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Supplier {
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

interface PurchaseDetail {
  id: number
  purchase_id: number
  product_id: number
  quantity: number
  unit_price: number
  sub_total: number
  product: Product
}

interface Purchase {
  id: number
  reference_no: string
  supplier_id: number
  purchase_date: string
  total_amount: number
  paid_amount: number
  due_amount: number
  purchase_status: {
    value: number
    label: string
  }
  payment_status: {
    value: number
    label: string
  }
  purchase_note: string
  created_at: string
  supplier: Supplier
  details: PurchaseDetail[]
}

interface ShowProps extends PageProps {
  purchase: Purchase
}

export default function Show({ auth, purchase }: ShowProps) {
  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ລາຍການສັ່ງຊື້', url: route('purchases.index') },
    { title: purchase.reference_no ? `${purchase.reference_no}` : 'ລາຍລະອຽດ', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">ລາຍລະອຽດການສັ່ງຊື້</h2>
              </div>
              <div className="flex space-x-3">
                <Link 
                  href={route('purchases.print', purchase.id)} 
                  className="inline-flex items-center px-4 py-2 bg-cyan-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  target="_blank"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                    <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"></path>
                  </svg>
                  ພິມລາຍການສັ່ງຊື້
                </Link>

                {typeof purchase.purchase_status === 'object' && purchase.purchase_status !== null && purchase.purchase_status.value === 0 && (
                  <Link 
                    href={route('purchases.edit', purchase.id)} 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                      <path d="M16 5l3 3"></path>
                    </svg>
                    ແກ້ໄຂລາຍການສັ່ງຊື້
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`ລາຍການສັ່ງຊື້: ${purchase.reference_no || 'ລາຍລະອຽດ'}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ຂໍ້ມູນການສັ່ງຊື້</h3>
                </div>
                <div className="p-6 space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ເລກທີ່ອ້າງອິງ:</span>
                    <span className="text-gray-900 dark:text-gray-100">{purchase.reference_no}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ວັນທີສັ່ງຊື້:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString('th-TH') : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ວັນທີບັນທຶກ:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {purchase.created_at ? new Date(purchase.created_at).toLocaleDateString('th-TH') : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ຍອດລວມທັງໝົດ:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      ₭{typeof purchase.total_amount === 'number' ? (purchase.total_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ຈ່າຍແລ້ວ:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      ₭{typeof purchase.paid_amount === 'number' ? (purchase.paid_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ຄ້າງຈ່າຍ:</span>
                    {typeof purchase.due_amount === 'number' && purchase.due_amount > 0 ? (
                      <span className="text-red-600 dark:text-red-400">
                        ₭{(purchase.due_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100">
                        ₭{typeof purchase.due_amount === 'number' ? (purchase.due_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ສະຖານະການສັ່ງຊື້:</span>
                    {(() => {
                      // ตรวจสอบว่ามี purchase_status ที่เป็น object และมี value หรือไม่
                      const statusValue = typeof purchase.purchase_status === 'object' && purchase.purchase_status !== null 
                        ? purchase.purchase_status.value 
                        : (typeof purchase.purchase_status === 'number' ? purchase.purchase_status : 0)
                      
                      // ดึงค่า label จาก object หรือกำหนดค่า default ตาม value
                      const statusLabel = typeof purchase.purchase_status === 'object' && purchase.purchase_status !== null 
                        ? purchase.purchase_status.label 
                        : (statusValue === 0 ? 'รออนุมัติ' : 'อนุมัติแล้ว')
                      
                      const classes = statusValue === 0 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' 
                        : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      
                      return (
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${classes}`}>
                          {statusLabel}
                        </span>
                      )
                    })()}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ສະຖານະການຈ່າຍເງີນ:</span>
                    {(() => {
                      // ตรวจสอบว่ามี payment_status ที่เป็น object และมี value หรือไม่
                      const paymentStatusValue = typeof purchase.payment_status === 'object' && purchase.payment_status !== null 
                        ? purchase.payment_status.value 
                        : (typeof purchase.payment_status === 'number' ? purchase.payment_status : 0)
                      
                      // ดึงค่า label จาก object หรือกำหนดค่า default ตาม value
                      const paymentStatusLabel = typeof purchase.payment_status === 'object' && purchase.payment_status !== null 
                        ? purchase.payment_status.label 
                        : (paymentStatusValue === 0 ? 'ຍັງບໍ່ຈ່າຍ' : (paymentStatusValue === 1 ? 'ຈ່າຍບາງສ່ວນ' : 'ຈ່າຍແລ້ວ'))
                      
                      const classes = paymentStatusValue === 0 
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' 
                        : paymentStatusValue === 1 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' 
                          : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      
                      return (
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${classes}`}>
                          {paymentStatusLabel}
                        </span>
                      )
                    })()}
                  </div>
                  {purchase.purchase_note && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ໝາຍເຫດ:</span>
                      <p className="text-gray-900 dark:text-gray-100">{purchase.purchase_note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ຂໍ້ມູນຊັບພາຍເອີ</h3>
                </div>
                <div className="p-6 space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ຊື່:</span>
                    <Link href={route('suppliers.show', purchase.supplier_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {purchase.supplier.name}
                    </Link>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ອີເມລ:</span>
                    <a href={`mailto:${purchase.supplier.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">{purchase.supplier.email}</a>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ເບີໂທລະສັບ:</span>
                    <span className="text-gray-900 dark:text-gray-100">{purchase.supplier.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">ທີ່ຢູ່:</span>
                    <span className="text-gray-900 dark:text-gray-100">{purchase.supplier.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-12">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ລາຍການສິນຄ້າທີ່ສັ່ງຊື້</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ລຳດັບ</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ລະຫັດສິນຄ້າ</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ຊື່ສິນຄ້າ</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ໝວດໝູ່</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ໜ່ວຍ</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ຈຳນວນ</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ລາຄາ/ໜ່ວຍ</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ລວມ</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {purchase.details.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.product.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <Link href={route('products.show', item.product_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {item.product.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.product.category.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.product.unit.short_code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">₭{(item.unit_price / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">₭{(item.sub_total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th colSpan={7} className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">ຍອດລວມທັງໝົດ</th>
                        <th className="px-6 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                          ₭{typeof purchase.total_amount === 'number' ? (purchase.total_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                        </th>
                      </tr>
                      <tr>
                        <th colSpan={7} className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">ຈ່າຍແລ້ວ</th>
                        <th className="px-6 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                          ₭{typeof purchase.paid_amount === 'number' ? (purchase.paid_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                        </th>
                      </tr>
                      <tr>
                        <th colSpan={7} className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">ค้างชำระ</th>
                        <th className="px-6 py-3 text-right text-sm">
                          {typeof purchase.due_amount === 'number' && purchase.due_amount > 0 ? (
                            <span className="text-red-600 dark:text-red-400">
                              ₭{(purchase.due_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-gray-900 dark:text-gray-100">
                              ₭{typeof purchase.due_amount === 'number' ? (purchase.due_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                            </span>
                          )}
                        </th>
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