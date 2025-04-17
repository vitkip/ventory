import { useState, FormEvent } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  bio: string | null
  profile_image: string | null
}

interface EditProps extends PageProps {
  user: User
}

export default function Edit({ auth, user }: EditProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profile_image ? `/storage/profiles/${user.profile_image}` : null
  )

  const { data, setData, post, errors, processing } = useForm({
    _method: 'PUT',
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    bio: user.bio || '',
    profile_image: null as File | null,
    password: '',
    password_confirmation: '',
  })

  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ຜູ້ໃຊ້ງານ', url: route('users.index') },
    { title: user.name, url: route('users.show', (user as any).username) },
    { title: 'ແກ້ໄຂ', url: undefined }
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post(route('users.update', (user as any).username))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setData('profile_image', file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ຜູ້ໃຊ້ງານ</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້ງານ</h2>
          </div>
        </div>
      }
    >
      <Head title={`ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້ງານ: ${user.name}`} />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ຮູປໂປຣຟາຍ</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-center mb-6">
                      <img
                        className="h-32 w-32 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        src={imagePreview || '/assets/img/demo/user-placeholder.svg'}
                        alt={user.name}
                      />
                    </div>
                    
                    <div className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">
                      JPG ຫຼື PNG ຂະໜາດບໍ່ເກີນ 2 MB
                    </div>
                    
                    <div className="relative">
                      <input
                        className={`w-full px-3 py-2 border ${errors.profile_image ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                        type="file"
                        id="profile_image"
                        name="profile_image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {errors.profile_image && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.profile_image}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ຂໍ້ມູນສ່ວນຕົວ</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <div className="mb-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ຊື່ <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="name"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                          />
                          {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="mb-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ອີເມລ <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                          />
                          {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ເບີໂທລະສັບ
                          </label>
                          <input
                            id="phone"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                          />
                          {errors.phone && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.phone}</p>}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="mb-4">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ທີ່ຢູ່
                          </label>
                          <textarea
                            id="address"
                            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            rows={3}
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                          ></textarea>
                          {errors.address && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.address}</p>}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="mb-4">
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ປະຫວັດຫຍໍ້
                          </label>
                          <textarea
                            id="bio"
                            className={`w-full px-3 py-2 border ${errors.bio ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            rows={3}
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                          ></textarea>
                          {errors.bio && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.bio}</p>}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-white dark:bg-gray-800 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">ປ່ຽນລະຫັດຜ່ານ</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">ເວັ້ນວ່າງໄວ້ຫາກບໍ່ຕ້ອງການປ່ຽນລະຫັດຜ່ານ</p>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ລະຫັດຜ່ານໃໝ່
                          </label>
                          <input
                            id="password"
                            type="password"
                            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                          />
                          {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password}</p>}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ຍືນຍັນລະຫັດຜ່ານໃໝ່
                          </label>
                          <input
                            id="password_confirmation"
                            type="password"
                            className={`w-full px-3 py-2 border ${errors.password_confirmation ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300`}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                          />
                          {errors.password_confirmation && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password_confirmation}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
                    <Link 
                      href={route('users.show', (user as any).username)} 
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