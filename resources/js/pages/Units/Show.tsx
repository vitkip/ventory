import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'
import DataTable from '@/Components/Table/DataTable'

interface Product {
  id: number
  name: string
  slug: string
  code: string
  category: {
    name: string
    slug: string
  }
  unit_id: number
  stock: number
  selling_price: number
  created_at: string
}

interface Unit {
  id: number
  name: string
  slug: string
  short_code: string
  created_at: string
  updated_at: string
  products: Product[]
}

interface ShowProps extends PageProps {
  unit: Unit
}

export default function Show({ auth, unit }: ShowProps) {
  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ໜ່ວຍວດ', url: route('units.index') },
    { title: unit.name, url: undefined }
  ]

  // คอลัมน์ตารางสินค้า
  const productColumns = [
    {
      field: 'name',
      label: 'ຊື່ສິນຄ້າ',
      sortable: true,
      render: (product: Product) => (
        <Link href={route('products.show', product.slug || product.id)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          {product.name}
        </Link>
      )
    },
    {
      field: 'code',
      label: 'ລະຫັດສິນຄ້າ',
      sortable: true
    },
    {
      field: 'category.name',
      label: 'ໝວດໝູ່',
      sortable: true,
      render: (product: Product) => (
        <span>{product.category?.name || '-'}</span>
      )
    },
    {
      field: 'stock',
      label: 'ຍັງເຫຼືອ',
      sortable: true,
      render: (product: Product) => (
        <span>{product.stock} {unit.short_code}</span>
      )
    },
    {
      field: 'selling_price',
      label: 'ລາຄາຂາຍ',
      sortable: true,
      render: (product: Product) => (
        <span>₭{parseFloat(product.selling_price.toString()).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
      )
    },
    {
      field: 'actions',
      label: 'ຈັດການ',
      render: (product: Product) => (
        <div className="flex items-center space-x-2">
          <Link 
            href={route('products.show', product.slug || product.id)} 
            className="inline-flex items-center px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
          >
            ເບີ່ງ
          </Link>
          <Link 
            href={route('products.edit', product.slug || product.id)} 
            className="inline-flex items-center px-2.5 py-1 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
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
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">ข้อมูล</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ໜ່ວຍວັດ: {unit.name}
                </h2>
              </div>
              <div>
                <Link
                  href={route('units.edit', unit.slug)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 hidden sm:inline-flex"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                    <path d="M16 5l3 3"></path>
                  </svg>
                  ແກ້ໄຂໜ່ວຍວັດ
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`ໜ່ວຍວັດ: ${unit.name}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ລາຍລະອຽດໜ່ວຍວັດ</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ຊື່ໜ່ວຍວັດ</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">{unit.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">{unit.slug}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ໂຄດຫຍໍ້</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">{unit.short_code}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ຈຳນວນສິນຄ້າທີ່ໃຊ້ໜ່ວຍນີ້</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">{unit.products?.length || 0} ລາຍການ</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ວັນທີສ້າງ</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">
                      {new Date(unit.created_at).toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ແກ້ໄຂເມື່ອວັນທີ</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">
                      {new Date(unit.updated_at).toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ສິນຄ້າທີ່ໃຊ້ໜ່ວຍວັດນີ້</h3>
              </div>
              <div className="p-4">
                {unit.products && unit.products.length > 0 ? (
                  <DataTable
                    data={unit.products}
                    columns={productColumns}
                    sortField="name"
                    sortDirection="asc"
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-400" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
                        <line x1="12" y1="12" x2="20" y2="7.5"></line>
                        <line x1="12" y1="12" x2="12" y2="21"></line>
                        <line x1="12" y1="12" x2="4" y2="7.5"></line>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">ບໍ່ມີສິນຄ້າທີ່ໃຊ້ໜ່ວຍນີ້</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      ເຈົ້າສາມາດເພີມສິນຄ້າໃໝ່ແລະເລືອກໜ່ວຍນີ້ໄດ້
                    </p>
                    <Link href={route('products.create')} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      ເພີມສິນຄ້າໃໝ່
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 