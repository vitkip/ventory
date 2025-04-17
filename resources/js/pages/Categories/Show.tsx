import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'
import DataTable from '@/Components/Table/DataTable'

interface Category {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

interface Product {
  id: number
  name: string
  code: string
  selling_price: number
  quantity: number
  unit: {
    id: number
    name: string
  } | null
}

interface ShowProps extends PageProps {
  category: Category
  products: Product[]
}

export default function Show({ auth, category, products }: ShowProps) {
  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'name',
      label: 'ຊື່ສິນຄ້າ',
      render: (product: Product) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
        </div>
      )
    },
    {
      field: 'code',
      label: 'ລະຫັດສິນຄ້າ'
    },
    {
      field: 'unit.name',
      label: 'ໜ່ວຍ',
      render: (product: Product) => product.unit?.name || '-'
    },
    {
      field: 'quantity',
      label: 'ຈຳນວນ',
    },
    {
      field: 'selling_price',
      label: 'ລາຄາຂາຍ',
      render: (product: Product) => (
        <span className="text-gray-900 dark:text-gray-100">฿{product.selling_price.toLocaleString('th-TH')}</span>
      )
    },
    {
      field: 'actions',
      label: 'ຈັດການ',
      className: 'w-1',
      render: (product: Product) => (
        <div className="flex items-center space-x-2">
          <Link 
            href={route('products.show', product.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ເບີ່ງ
          </Link>
          <Link 
            href={route('products.edit', product.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ແກ້ໄຂ
          </Link>
        </div>
      )
    }
  ]

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'หมวดหมู่', url: route('categories.index') },
    { title: category.name, url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">ລາຍລະອຽດ</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ໝວດໝູ່: {category.name}
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`รายละเอียดหมวดหมู่ - ${category.name}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ຂໍ້ມູນໝວດໝູ່</h3>
                  <Link href={route('categories.edit', category.slug)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    ແກ້ໄຂ
                  </Link>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 font-semibold text-gray-700 dark:text-gray-300">ຊື່</div>
                      <div className="md:w-2/3 text-gray-900 dark:text-gray-100">{category.name}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 font-semibold text-gray-700 dark:text-gray-300">Slug</div>
                      <div className="md:w-2/3 text-gray-900 dark:text-gray-100">{category.slug}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 font-semibold text-gray-700 dark:text-gray-300">ວັນທີສ້າງ</div>
                      <div className="md:w-2/3 text-gray-900 dark:text-gray-100">{new Date(category.created_at).toLocaleDateString('th-TH')}</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 font-semibold text-gray-700 dark:text-gray-300">ແກ້ໄຂເມື່ອວັນທີ</div>
                      <div className="md:w-2/3 text-gray-900 dark:text-gray-100">{new Date(category.updated_at).toLocaleDateString('th-TH')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <DataTable
                data={products}
                columns={columns}
                title={`ສິນຄ້າໃນໝວດໝູ່ (${products.length})`}
                noDataText="ບໍ່ມີສິນຄ້າໃນໝວດໝູ່ນີ້"
              />
            </div>
          </div>
          
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 