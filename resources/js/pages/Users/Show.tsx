import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'
import { FaPencilAlt, FaLock, FaUnlock } from 'react-icons/fa'

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  phone: string | null
  address: string | null
  bio: string | null
  profile_image: string | null
}

interface ShowProps extends PageProps {
  user: User
}

export default function Show({ auth, user }: ShowProps) {
  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ຜູ້ໃຊ້ງານ', url: route('users.index') },
    { title: user.name, url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ຜູ້ໃຊ້ງານ</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ຂໍ້ມູນຜູ້ໃຊ້ງານ</h2>
          </div>
        </div>
      }
    >
      <Head title={`ຂໍ້ມູນຜູ້ໃຊ້ງານ: ${user.name}`} />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ຂໍ້ມູນສ່ວນຕົວ</h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <img
                      src={user.profile_image ? `/storage/profiles/${user.profile_image}` : '/assets/img/demo/user-placeholder.svg'}
                      alt={user.name}
                      className="h-32 w-32 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <h4 className="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">{user.name}</h4>
                    <div className="flex mt-6 space-x-2">
                      <Link
                        href={route('users.edit', (user as any).username || user.id)}
                        className="inline-flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                      >
                        <FaPencilAlt className="mr-2" />
                        ແກ້ໄຂ
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ອີເມລ</h5>
                      <div className="flex items-center text-gray-900 dark:text-gray-100">
                        {user.email}
                        {user.email_verified_at ? (
                          <span 
                            className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            title="ยืนยันอีเมลแล้ว"
                          >
                            <FaUnlock className="mr-1" size={10} />
                            ຍືນຍັນແລ້ວ
                          </span>
                        ) : (
                          <span 
                            className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            title="ยังไม่ยืนยันอีเมล"
                          >
                            <FaLock className="mr-1" size={10} />
                            ຍັງບໍ່ທັນຍືນຍັນ
                          </span>
                        )}
                      </div>
                    </div>

                    {user.phone && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ເບີໂທລະສັບ</h5>
                        <div className="text-gray-900 dark:text-gray-100">{user.phone}</div>
                      </div>
                    )}

                    {user.address && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ທີ່ຢູ່</h5>
                        <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line">{user.address}</div>
                      </div>
                    )}

                    {user.bio && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ປະຫວັດຫຍໍ້</h5>
                        <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line">{user.bio}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 