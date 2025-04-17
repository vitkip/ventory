import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface QuotationItem {
  id: number
  product_id: number
  product_name: string
  unit_price: number
  quantity: number
  total_price: number
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface Quotation {
  id: number
  reference: string
  date: string
  due_date: string
  customer_id: number
  customer: Customer
  total_amount: number
  discount_amount: number
  tax_amount: number
  grand_total: number
  notes: string
  terms: string
  status: number
  items: QuotationItem[]
}

interface ShowProps extends PageProps {
  quotation: Quotation
}

export default function Show({ auth, quotation }: ShowProps) {
  // แปลงสถานะเป็นข้อความ
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'ร่าง'
      case 1: return 'ส่งแล้ว'
      case 2: return 'ขายแล้ว'
      case 3: return 'ยกเลิก'
      default: return 'ไม่ระบุ'
    }
  }

  // แปลงสถานะเป็น CSS class
  const getStatusClass = (status: number) => {
    switch (status) {
      case 0: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 1: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
      case 2: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      case 3: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
      default: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH')
  }

  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'ใบเสนอราคา', url: route('quotations.index') },
    { title: 'รายละเอียด', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">รายละเอียด</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ใบเสนอราคา #{quotation.reference}</h2>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => window.print()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                  พิมพ์ใบเสนอราคา
                </button>
                {quotation.status !== 2 && quotation.status !== 3 && (
                  <Link
                    href={route('quotations.edit', quotation.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    แก้ไข
                  </Link>
                )}
                {quotation.status === 1 && (
                  <Link
                    href={route('quotations.convert-to-sale', quotation.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    แปลงเป็นรายการขาย
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`ใบเสนอราคา #${quotation.reference}`} />
      
      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">รายละเอียดใบเสนอราคา</h3>
              <div>
                <span className={getStatusClass(quotation.status)}>
                  {getStatusText(quotation.status)}
                </span>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">ข้อมูลลูกค้า</h4>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-bold">{quotation.customer.name}</p>
                    <p>อีเมล: {quotation.customer.email}</p>
                    <p>โทร: {quotation.customer.phone}</p>
                    <p>ที่อยู่: {quotation.customer.address}</p>
                  </div>
                </div>
                <div className="md:text-right">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">รายละเอียดใบเสนอราคา</h4>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p><span className="font-medium">เลขที่อ้างอิง:</span> {quotation.reference}</p>
                    <p><span className="font-medium">วันที่:</span> {formatDate(quotation.date)}</p>
                    <p><span className="font-medium">วันที่หมดอายุ:</span> {formatDate(quotation.due_date)}</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ลำดับ</th>
                      <th className="px-3 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สินค้า</th>
                      <th className="px-3 py-3 bg-gray-50 dark:bg-gray-700 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">ราคาต่อหน่วย</th>
                      <th className="px-3 py-3 bg-gray-50 dark:bg-gray-700 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">จำนวน</th>
                      <th className="px-3 py-3 bg-gray-50 dark:bg-gray-700 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">ยอดรวม</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {quotation.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                        <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">{item.product_name}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">฿{formatCurrency(item.unit_price)}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">{item.quantity}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">฿{formatCurrency(item.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <td colSpan={4} className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300 text-right font-medium">ยอดรวม:</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">฿{formatCurrency(quotation.total_amount)}</td>
                    </tr>
                    {quotation.discount_amount > 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300 text-right font-medium">ส่วนลด:</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400 text-right">-฿{formatCurrency(quotation.discount_amount)}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={4} className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300 text-right font-medium">ภาษีมูลค่าเพิ่ม (7%):</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">฿{formatCurrency(quotation.tax_amount)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-bold">ยอดรวมสุทธิ:</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-bold">฿{formatCurrency(quotation.grand_total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {quotation.notes && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">หมายเหตุ</h4>
                  <p className="text-gray-700 dark:text-gray-300">{quotation.notes}</p>
                </div>
              )}
              
              {quotation.terms && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">เงื่อนไขและข้อตกลง</h4>
                  <p className="text-gray-700 dark:text-gray-300">{quotation.terms}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 