import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'
import DataTable from '@/Components/Table/DataTable'

interface Purchase {
  id: number
  purchase_no: string
  supplier_id: number
  date: string
  total_amount: number
  status: string
}

interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  shopname: string
  address: string
  type: {
    value: string
    label: string
  }
  photo: string | null
  account_holder: string | null
  account_number: string | null
  bank_name: string | null
  created_at: string
  updated_at: string
  purchases: Purchase[]
}

interface ShowProps extends PageProps {
  supplier: Supplier
}

export default function Show({ auth, supplier }: ShowProps) {
  const breadcrumbsItems = [
    { title: 'ຫນ້າຫຼັກ', url: route('dashboard') },
    { title: 'ຊັບພາຍເອີ', url: route('suppliers.index') },
    { title: supplier.name, url: undefined }
  ]

  // คอลัมน์ตารางสำหรับรายการซื้อ
  const purchaseColumns = [
    {
      field: 'purchase_no',
      label: 'ເລກບິນທີ່ສັ່ງຊື້',
      sortable: true,
      render: (purchase: Purchase) => (
        <Link 
          href={route('purchases.show', purchase.id)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {purchase.purchase_no}
        </Link>
      )
    },
    {
      field: 'date',
      label: 'ວັນທີ',
      sortable: true
    },
    {
      field: 'total_amount',
      label: 'ຈຳນວນເງີນລວມ',
      sortable: true,
      render: (purchase: Purchase) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">฿{parseFloat(purchase.total_amount.toString()).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
      )
    },
    {
      field: 'status',
      label: 'ສະຖານະ',
      sortable: true,
      render: (purchase: Purchase) => {
        let statusClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        
        if (purchase.status === 'completed') {
          statusClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        } else if (purchase.status === 'pending') {
          statusClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        } else if (purchase.status === 'cancelled') {
          statusClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }
        
        return <span className={statusClass}>{purchase.status}</span>
      }
    },
    {
      field: 'actions',
      label: 'ຈັດການ',
      render: (purchase: Purchase) => (
        <div className="flex items-center space-x-2">
          <Link 
            href={route('purchases.show', purchase.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ເບີ່ງ
          </Link>
          <Link 
            href={route('purchases.edit', purchase.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ແກ້ໄຂ
          </Link>
        </div>
      )
    }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ຂໍ້ມູນ</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{supplier.name}</h2>
          </div>
        </div>
      }
    >
      <Head title={`ຊັບພາຍເອີ: ${supplier.name}`} />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ຮູປໂປຟາຍ</h3>
                </div>
                <div className="p-6">
                  <div className="flex justify-center">
                    <img
                      src={supplier.photo ? `/storage/${supplier.photo}` : '/assets/img/demo/user-placeholder.svg'}
                      alt={supplier.name}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-[250px]"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex">
                  <Link
                    href={route('suppliers.edit', supplier.id)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    ແກ້ໄຂຊັບພາຍເອີ
                  </Link>
                  <Link
                    href={route('suppliers.index')}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium ml-auto"
                  >
                   ກັບໄປຍັງລາຍການຊັບພາຍເອີ
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">รายละเอียดซัพพลายเออร์</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ຊື່</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{supplier.name}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ອີເມລ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{supplier.email}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ເບີໂທລະສັບ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{supplier.phone}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ທີ່ຢູ່</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{supplier.address}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ຊື່ຮ້ານ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{supplier.shopname}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ປະເພດ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{supplier.type.label}</td>
                      </tr>
                      {supplier.account_holder && (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ຊື່ເຈົ້າຂອງບັນຊີ</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{supplier.account_holder}</td>
                        </tr>
                      )}
                      {supplier.account_number && (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ເລກບັນຊີ</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{supplier.account_number}</td>
                        </tr>
                      )}
                      {supplier.bank_name && (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 w-1/3">ຊື່ທະນາຄານ</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{supplier.bank_name}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {supplier.purchases && supplier.purchases.length > 0 && (
                <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ລາຍການສັ່ງຊື້</h3>
                  </div>
                  <div className="p-6">
                    <DataTable
                      data={supplier.purchases}
                      columns={purchaseColumns}
                      sortField="date"
                      sortDirection="desc"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 