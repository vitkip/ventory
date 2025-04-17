import { useState } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

export default function Create({ auth }: PageProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const { data, setData, post, errors, processing } = useForm({
    photo: null as File | null,
    name: '',
    email: '',
    phone: '',
    address: '',
    account_holder: '',
    account_number: '',
    bank_name: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('customers.store'))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setData('photo', file)
      
      // สร้าง preview ของรูปภาพ
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ລູກຄ້າ', url: route('customers.index') },
    { title: 'ເພີ່ມລູກຄ້າໃໝ່', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ລາຍການ</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ເພີ່ມລູກຄ້າໃໝ່</h2>
          </div>
        </div>
      }
    >
      <Head title="ເພີ່ມລູກຄ້າໃໝ່" />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">รูปลูกค้า</h3>
                  </div>
                  <div className="p-6">
                    <img 
                      className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-4" 
                      src={imagePreview || '/assets/img/demo/user-placeholder.svg'} 
                      alt="รูปโปรไฟล์ลูกค้า"
                    />

                    <div className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">
                      ຟາຍທີ່ຮອງຮັບ JPG ຫຼື PNG ຂະໜາດບໍ່ເກີນ 2 MB
                    </div>

                    <div className="relative">
                      <input 
                        className={`w-full px-3 py-2 border ${errors.photo ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                        type="file"  
                        id="image" 
                        onChange={handlePhotoChange}
                        accept="image/*"
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ข้อมูลลูกค้า</h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ຊື່ <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="name"
                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                        placeholder="ກອກຊື່ລູກຄ້າ" 
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ອີເມລ <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="email" 
                        id="email"
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                        placeholder="ກອກອີເມລ" 
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ເບີໂທລະສັບ <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="phone"
                        className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                        placeholder="ກອກເບີໂທລະສັບ" 
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ທີ່ຢູ່ <span className="text-red-600">*</span>
                      </label>
                      <textarea 
                        id="address"
                        className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                        rows={3} 
                        placeholder="ກອກທີ່ຢູ່"
                        value={data.address}
                        onChange={e => setData('address', e.target.value)}
                      ></textarea>
                      {errors.address && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.address}</p>
                      )}
                    </div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-gray-800 px-2 text-sm text-gray-500 dark:text-gray-400">ข้อมูลบัญชีธนาคาร (ไม่บังคับ)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="account_holder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ຊື່ເຈົ້າຂອງບັນຊີ
                        </label>
                        <input 
                          type="text" 
                          id="account_holder"
                          className={`w-full px-3 py-2 border ${errors.account_holder ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                          placeholder="ກອກຊື່ເຈົ້າຂອງບັນຊີ" 
                          value={data.account_holder}
                          onChange={e => setData('account_holder', e.target.value)}
                        />
                        {errors.account_holder && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.account_holder}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ເລກບັນຊີ
                        </label>
                        <input 
                          type="text" 
                          id="account_number"
                          className={`w-full px-3 py-2 border ${errors.account_number ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                          placeholder="ກອກເລກບັນຊີ" 
                          value={data.account_number}
                          onChange={e => setData('account_number', e.target.value)}
                        />
                        {errors.account_number && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.account_number}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ທະນາຄານ
                        </label>
                        <input 
                          type="text" 
                          id="bank_name"
                          className={`w-full px-3 py-2 border ${errors.bank_name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                          placeholder="ກອກຊື່ທະນາຄານ" 
                          value={data.bank_name}
                          onChange={e => setData('bank_name', e.target.value)}
                        />
                        {errors.bank_name && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.bank_name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
                    <Link 
                      href={route('customers.index')} 
                      className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 mr-2"
                    >
                      ຍົກເລີກ
                    </Link>
                    <button 
                      type="submit" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                      disabled={processing}
                    >
                      {processing ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກຂໍ້ມູນ'}
                    </button>
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