import { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

export default function Create({ auth }: PageProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    shopname: '',
    type: '', // distributor, wholesaler, producer
    photo: null as File | null,
    account_holder: '',
    account_number: '',
    bank_name: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('suppliers.store'))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setData('photo', file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'ซัพพลายเออร์', url: route('suppliers.index') },
    { title: 'เพิ่มซัพพลายเออร์ใหม่', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ฟอร์ม</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">เพิ่มซัพพลายเออร์ใหม่</h2>
          </div>
        </div>
      }
    >
      <Head title="เพิ่มซัพพลายเออร์ใหม่" />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">รูปโปรไฟล์</h3>
                  </div>
                  <div className="p-6">
                    <img
                      className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-4"
                      src={imagePreview || '/assets/img/demo/user-placeholder.svg'}
                      alt="รูปโปรไฟล์"
                    />

                    <div className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">
                      JPG หรือ PNG ขนาดไม่เกิน 1 MB
                    </div>

                    <div className="relative">
                      <input
                        className={`w-full px-3 py-2 border ${errors.photo ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                        type="file"
                        id="image"
                        name="photo"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {errors.photo && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.photo}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">รายละเอียดซัพพลายเออร์</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <div className="mb-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ชื่อ <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="name"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                          />
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            อีเมล <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                          />
                          {errors.email && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="shopname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ชื่อร้าน <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="shopname"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.shopname ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.shopname}
                            onChange={(e) => setData('shopname', e.target.value)}
                          />
                          {errors.shopname && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.shopname}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เบอร์โทรศัพท์ <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="phone"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                          />
                          {errors.phone && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ประเภทซัพพลายเออร์ <span className="text-red-600">*</span>
                          </label>
                          <select
                            id="type"
                            className={`w-full px-3 py-2 border ${errors.type ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                          >
                            <option value="" disabled>
                              เลือกประเภท:
                            </option>
                            <option value="distributor">ผู้จัดจำหน่าย (Distributor)</option>
                            <option value="wholesaler">ผู้ค้าส่ง (Wholesaler)</option>
                            <option value="producer">ผู้ผลิต (Producer)</option>
                          </select>
                          {errors.type && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.type}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ชื่อธนาคาร
                          </label>
                          <input
                            id="bank_name"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.bank_name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.bank_name}
                            onChange={(e) => setData('bank_name', e.target.value)}
                          />
                          {errors.bank_name && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.bank_name}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label htmlFor="account_holder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ชื่อเจ้าของบัญชี
                          </label>
                          <input
                            id="account_holder"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.account_holder ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.account_holder}
                            onChange={(e) => setData('account_holder', e.target.value)}
                          />
                          {errors.account_holder && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.account_holder}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เลขที่บัญชี
                          </label>
                          <input
                            id="account_number"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.account_number ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.account_number}
                            onChange={(e) => setData('account_number', e.target.value)}
                          />
                          {errors.account_number && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.account_number}</p>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="mb-4">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ที่อยู่ <span className="text-red-600">*</span>
                          </label>
                          <textarea
                            id="address"
                            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            rows={3}
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                          ></textarea>
                          {errors.address && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
                    <button 
                      type="submit" 
                      className="inline-flex items-center px-4 mr-2 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 ml-3"
                      disabled={processing}
                    >
                      บันทึก
                    </button>
                    <Link
                      href={route('suppliers.index')}
                      className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                      ยกเลิก
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 