import { useState, FormEvent } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string | null
  address: string | null
  photo: string | null
  bio: string | null
}

interface SettingsProps extends PageProps {
  user: User
}

export default function Settings({ auth, user }: SettingsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const { data, setData, post, errors, processing } = useForm({
    password: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post(route('profile.destroy'))
  }

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'ข้อมูลส่วนตัว', url: route('profile.edit') },
    { title: 'การตั้งค่าบัญชี', url: undefined }
  ]

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="การตั้งค่าบัญชี" />
      
      <div className="pb-12">
        <div className="container-xl">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">การตั้งค่าบัญชี</h2>
              <p className="text-gray-500 text-sm">จัดการการตั้งค่าบัญชีและความปลอดภัย</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-red-600 mb-2">ลบบัญชี</h3>
                <p className="text-gray-500 mb-4">
                  เมื่อบัญชีของคุณถูกลบ ทรัพยากรและข้อมูลทั้งหมดจะถูกลบอย่างถาวร โปรดดาวน์โหลดข้อมูลหรือข้อมูลใดๆ ที่คุณต้องการเก็บไว้ก่อนลบบัญชีของคุณ
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  ลบบัญชี
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี?</h2>
              <p className="text-gray-500 mb-6">
                เมื่อบัญชีของคุณถูกลบ ทรัพยากรและข้อมูลทั้งหมดจะถูกลบอย่างถาวร กรุณาใส่รหัสผ่านของคุณเพื่อยืนยันว่าคุณต้องการลบบัญชีของคุณอย่างถาวร
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
                  <input
                    type="password"
                    id="password"
                    className={`w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.password ? 'border-red-500' : ''}`}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                  />
                  {errors.password && (
                    <div className="text-red-500 mt-1 text-sm">{errors.password}</div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-900 uppercase tracking-widest hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150 mr-2"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    disabled={processing}
                  >
                    {processing ? 'กำลังลบบัญชี...' : 'ลบบัญชี'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  )
} 