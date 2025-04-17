import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Category {
  id: number
  name: string
  slug: string
}

interface Unit {
  id: number
  name: string
  short_code: string
}

interface Product {
  id: number
  name: string
  slug: string
  code: string
  quantity: number
  quantity_alert: number
  buying_price: number
  selling_price: number
  tax: number
  tax_type: number
  notes: string
  product_image: string | null
  category: Category
  unit: Unit
  created_at: string
  updated_at: string
}

interface ShowProps extends PageProps {
  product: Product
  barcode: string
}

export default function Show({ auth, product, barcode }: ShowProps) {
  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ສິນຄ້າ', url: route('products.index') },
    { title: product.name, url: undefined }
  ]

  // แปลงค่าภาษี
  const taxTypeText = product.tax_type === 0 ? 'ລວມໃນລາຄາສິນຄ້າ' : 'ແຍກຕ່າງຫາກ'

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">ລາຍລະອຽດ</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h2>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href={route('products.edit', product.slug)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                ແກ້ໄຂ
              </Link>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`สินค้า: ${product.name}`} />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ຮູບສິນຄ້າ</h3>
                </div>
                <div className="p-6 text-center">
                  <img
                    src={product.product_image ? `/storage/products/${product.product_image}` : '/assets/img/products/default.webp'}
                    alt={product.name}
                    className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 mx-auto"
                    style={{ maxHeight: '250px' }}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ບາໂຄດ</h3>
                </div>
                <div className="p-6 text-center">
                  <div dangerouslySetInnerHTML={{ __html: barcode }} />
                  <div className="mt-2 text-gray-700 dark:text-gray-300">{product.code}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ຂໍ້ມູນສິນຄ້າ</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ຊື່ສິນຄ້າ</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">{product.name}</div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">Slug</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">{product.slug}</div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ລະຫັດສິນຄ້າ</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">{product.code}</div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ໝວດໝູ່</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">
                      {product.category ? (
                        <Link 
                          href={route('categories.show', product.category?.slug || product.category?.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {product.category.name}
                        </Link>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ໜ່ວຍວັດ</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">
                      {product.unit ? (
                        <Link 
                          href={route('units.show', product.unit.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {product.unit.name} ({product.unit.short_code})
                        </Link>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ຈຳນວນຄົງເຫຼືອ</div>
                    <div className="col-span-2">
                      <span className={product.quantity <= product.quantity_alert ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}>
                        {product.quantity.toLocaleString()} {product.unit?.short_code || ''}
                      </span>
                      {product.quantity <= product.quantity_alert && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          ສິນຄ້າໄກຈະໝົດ
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ຈຳນວນແຈ້ງເຕືອນ</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">{product.quantity_alert.toLocaleString()} {product.unit?.short_code || ''}</div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ລາຄາຊື້</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">฿{product.buying_price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ລາຄາຂາຍ</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">฿{product.selling_price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ພາສີ</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">{product.tax > 0 ? `${product.tax}% (${taxTypeText})` : 'ไม่มี'}</div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ວັນທີສ້າງ</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">{new Date(product.created_at).toLocaleDateString('th-TH', { dateStyle: 'long' })}</div>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ວັນທີແກ້ໄຂ</div>
                    <div className="col-span-2 text-gray-900 dark:text-gray-100">{new Date(product.updated_at).toLocaleDateString('th-TH', { dateStyle: 'long' })}</div>
                  </div>
                  {product.notes && (
                    <div className="grid grid-cols-3 px-6 py-4">
                      <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">ໝາຍເຫດ</div>
                      <div className="col-span-2 text-gray-900 dark:text-gray-100">{product.notes}</div>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
                  <Link 
                    href={route('products.index')} 
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                  >
                    ກັບໄປຍັງລາຍການສິນຄ້າ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 