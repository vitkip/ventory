import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DataTable from '@/Components/Table/DataTable'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Unit {
  id: number
  name: string
  slug: string
  short_code: string
  created_at: string
  updated_at: string
}

interface UnitsProps extends PageProps {
  units: {
    data: Unit[]
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

export default function Index({ auth, units, filters }: UnitsProps) {
  const [loading, setLoading] = useState(false)

  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'name',
      label: 'ຊື່ໜ່ວຍວັດ',
      sortable: true,
      render: (unit: Unit) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{unit.name}</div>
        </div>
      )
    },
    {
      field: 'slug',
      label: 'Slug',
      sortable: true
    },
    {
      field: 'short_code',
      label: 'ໂຄດຫຍໍ້',
      sortable: true
    },
    {
      field: 'actions',
      label: 'ຈັດການ',
      className: 'w-1',
      render: (unit: Unit) => (
        <div className="flex items-center space-x-2">
          <Link 
            href={route('units.show', unit.slug)} 
            className="inline-flex items-center px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
          >
            ເບີ່ງ
          </Link>
          <Link 
            href={route('units.edit', unit.slug)} 
            className="inline-flex items-center px-2.5 py-1 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
          >
            ແກ້ໄຂ
          </Link>
          <button 
            onClick={() => handleDelete(unit.id)}
            className="inline-flex items-center px-2.5 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
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
      route('units.index'),
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
      route('units.index'),
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
      route('units.index'),
      { ...filters, field, direction },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => setLoading(false)
      }
    )
  }

  // จัดการการลบรายการ
  const handleDelete = (id: number) => {
    if (confirm('ເຈົ້າແນ່ໃຈບໍ່ທີ່ຈະລືບໜ່ວຍນີ້?')) {
      router.delete(route('units.destroy', id), {
        onSuccess: () => {
          // แสดง toast หรือ notification แจ้งลบสำเร็จ
        }
      })
    }
  }

  // ปุ่มสำหรับใส่ใน actions ของ DataTable
  const tableActions = (
    <>
      <Link 
        href={route('units.create')}
        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 hidden sm:inline-flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        ເພີ່ມໜ່ວຍວັດໃໝ່
      </Link>
      <Link 
        href={route('units.create')}
        className="inline-flex items-center p-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 sm:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
      </Link>
    </>
  )

  // การจัดรูปแบบข้อมูลการแบ่งหน้าสำหรับ DataTable
  const pagination = {
    total: units.total,
    currentPage: units.current_page,
    perPage: units.per_page,
    links: units.links,
    from: units.from,
    to: units.to
  }

  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ໜ່ວຍວັດ', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">รายการ</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ໜ່ວຍວັດ
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <Head title="ໜ່ວຍວັດ" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <DataTable
            data={units.data}
            columns={columns}
            pagination={pagination}
            onSearch={handleSearch}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            sortField={filters.field}
            sortDirection={filters.direction}
            loading={loading}
            title="ລາຍການໜ່ວຍວັດ"
            actions={tableActions}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 