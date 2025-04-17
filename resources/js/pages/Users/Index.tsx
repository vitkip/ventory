import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DataTable from '@/Components/Table/DataTable'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface User {
  id: number
  name: string
  email: string
  role: {
    id: number
    name: string
  }
  email_verified_at: string | null
  created_at: string
  username: string
}

interface UsersProps extends PageProps {
  users: {
    data: User[]
    total: number
    current_page: number
    per_page: number
    links: Array<{ url: string | null; label: string; active: boolean }>
    from: number
    to: number
  }
  filters: {
    search: string
    perPage: number
    field: string
    direction: 'asc' | 'desc'
  }
}

export default function Index({ auth, users, filters }: UsersProps) {
  const [loading, setLoading] = useState(false)

  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'name',
      label: 'ຊື່',
      sortable: true
    },
    {
      field: 'email',
      label: 'ອີເມວ',
      sortable: true
    },
    {
      field: 'role.name',
      label: 'ສິດທິໃນການໃຊ້ງານ',
      sortable: true,
      render: (user: User) => (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {user.role?.name || 'ຜູ້ໃຊ້ທົ່ວໄປ'}
        </span>
      )
    },
    {
      field: 'email_verified_at',
      label: 'ຍືນຍັນອີເມວ',
      sortable: true,
      render: (user: User) => (
        user.email_verified_at ? 
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">ຍືນຍັນແລ້ວ</span> : 
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">ຍັງບໍ່ທັນຍືນຍັນ</span>
      )
    },
    {
      field: 'created_at',
      label: 'ວັນທີສ້າງ',
      sortable: true,
      render: (user: User) => (
        <span className="text-gray-900 dark:text-gray-100">{new Date(user.created_at).toLocaleDateString('th-TH')}</span>
      )
    },
    {
      field: 'actions',
      label: 'ຈັດການ',
      className: 'w-1',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Link 
            href={route('users.show', user.username)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ເບີ່ງ
          </Link>
          <Link 
            href={route('users.edit', user.username)} 
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ແກ້ໄຂ
          </Link>
          <button 
            onClick={() => handleDelete(user.username)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            disabled={user.username === (auth.user as any).username}
          >
            ລົບ
          </button>
        </div>
      )
    }
  ]

  // จัดการค้นหา
  const handleSearch = (value: string) => {
    setLoading(true)
    router.get(
      route('users.index'),
      { ...filters, search: value },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => setLoading(false)
      }
    )
  }

  // จัดการจำนวนแสดงต่อหน้า
  const handlePerPageChange = (value: number) => {
    setLoading(true)
    router.get(
      route('users.index'),
      { ...filters, perPage: value },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => setLoading(false)
      }
    )
  }

  // จัดการการเรียงลำดับ
  const handleSort = (field: string) => {
    setLoading(true)
    
    const direction = field === filters.field && filters.direction === 'asc' ? 'desc' : 'asc'
    
    router.get(
      route('users.index'),
      { ...filters, field, direction },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => setLoading(false)
      }
    )
  }

  // จัดการการลบรายการ
  const handleDelete = (username: string) => {
    if (username === (auth.user as any).username) {
      alert('ບໍ່ສາມາດລົບບັນຊີຂອງຕົວເອງໄດ້')
      return
    }

    if (confirm('ເຈົ້າແນ່ໃຈຫຼືບໍ່ທີ່ຈະລົບຜູ້ໃຊ້ນີ້?')) {
      router.delete(route('users.destroy', username), {
        onSuccess: () => {
          // แสดง toast หรือ notification แจ้งลบสำเร็จ
        }
      })
    }
  }

  // ปุ่มสำหรับใส่ใน actions ของ DataTable
  const tableActions = (
    <div className="flex items-center space-x-3">
      <Link 
        href={route('users.create')}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        ເພີ່ມຜູ້ໃຊ້ໃໝ່
      </Link>
      <Link 
        href={route('users.create')}
        className="sm:hidden inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  )

  // การจัดรูปแบบข้อมูลการแบ่งหน้าสำหรับ DataTable
  const pagination = {
    total: users.total,
    currentPage: users.current_page,
    perPage: users.per_page,
    links: users.links,
    from: users.from,
    to: users.to
  }

  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ຜູ້ໃຊ້', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">ລາຍການ</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ຜູ້ໃຊ້ງານ</h2>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title="ຜູ້ໃຊ້ງານ" />
      
      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <DataTable
            data={users.data}
            columns={columns}
            pagination={pagination}
            onSearch={handleSearch}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            sortField={filters.field}
            sortDirection={filters.direction}
            loading={loading}
            title="ລາຍການຜູ້ໃຊ້ງານ"
            actions={tableActions}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 