import { useState, FormEvent } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface User {
  id: number
  name: string
  email: string
  profile_image: string | null
  phone: string | null
  address: string | null
  bio: string | null
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
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'โปรไฟล์', url: undefined }
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post(route('profile.update'))
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
        <div className="mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
            แก้ไขโปรไฟล์
          </h2>
        </div>
      }
    >
      <Head title="โปรไฟล์" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* รูปโปรไฟล์ */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">รูปโปรไฟล์</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="relative w-24 h-24">
                        <img
                          className="w-24 h-24 rounded-full object-cover"
                          src={imagePreview || '/assets/img/demo/user-placeholder.svg'}
                          alt={user.name}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 dark:text-gray-400 italic mb-2">
                        JPG หรือ PNG ขนาดไม่เกิน 2 MB
                      </div>
                      <div className="mt-1">
                        <input
                          className={`block w-full p-2 text-sm text-gray-700 dark:text-gray-300 
                                    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                                    file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700
                                    dark:file:bg-gray-700 dark:file:text-gray-200
                                    hover:file:bg-gray-200 dark:hover:file:bg-gray-600
                                    ${errors.profile_image ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}`}
                          type="file"
                          id="profile_image"
                          name="profile_image"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {errors.profile_image && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.profile_image}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ข้อมูลส่วนตัวและรหัสผ่าน */}
              <div className="w-full lg:w-2/3">
                {/* ข้อมูลส่วนตัว */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">ข้อมูลส่วนตัว</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                        ชื่อ <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        className={`mt-1 block w-full p-2 rounded-md shadow-sm 
                                  ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} 
                                  dark:bg-gray-700 dark:text-white`}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                        อีเมล <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`mt-1 block w-full p-2 rounded-md shadow-sm 
                                  ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} 
                                  dark:bg-gray-700 dark:text-white`}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="phone">
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        id="phone"
                        type="text"
                        className={`mt-1 block w-full p-2 rounded-md shadow-sm 
                                  ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} 
                                  dark:bg-gray-700 dark:text-white`}
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="address">
                        ที่อยู่
                      </label>
                      <textarea
                        id="address"
                        className={`mt-1 block w-full p-2 rounded-md shadow-sm 
                                  ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} 
                                  dark:bg-gray-700 dark:text-white`}
                        rows={3}
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                      ></textarea>
                      {errors.address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="bio">
                        ประวัติย่อ
                      </label>
                      <textarea
                        id="bio"
                        className={`mt-1 block w-full p-2 rounded-md shadow-sm 
                                  ${errors.bio ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} 
                                  dark:bg-gray-700 dark:text-white`}
                        rows={3}
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                      ></textarea>
                      {errors.bio && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>}
                    </div>
                  </div>
                </div>

                {/* เปลี่ยนรหัสผ่าน */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg mt-6">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">เปลี่ยนรหัสผ่าน</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="current_password">
                        รหัสผ่านปัจจุบัน
                      </label>
                      <input
                        id="current_password"
                        type="password"
                        className={`mt-1 block w-full p-2 rounded-md shadow-sm 
                                  ${errors.current_password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} 
                                  dark:bg-gray-700 dark:text-white`}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                      />
                      {errors.current_password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.current_password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                        รหัสผ่านใหม่
                      </label>
                      <input
                        id="password"
                        type="password"
                        className={`mt-1 block w-full p-2 rounded-md shadow-sm 
                                  ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} 
                                  dark:bg-gray-700 dark:text-white`}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                      />
                      {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password_confirmation">
                        ยืนยันรหัสผ่านใหม่
                      </label>
                      <input
                        id="password_confirmation"
                        type="password"
                        className={`mt-1 block w-full p-2 rounded-md shadow-sm 
                                  ${errors.password_confirmation ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} 
                                  dark:bg-gray-700 dark:text-white`}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                      />
                      {errors.password_confirmation && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-right">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                      disabled={processing}
                    >
                      {processing ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
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