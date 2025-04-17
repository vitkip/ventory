import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DataTable from '@/Components/Table/DataTable'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  shopname: string
  type: string
  address: string
  photo: string | null
  created_at: string
  updated_at: string
}

interface SuppliersProps extends PageProps {
  suppliers: {
    data: Supplier[]
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

export default function Index({ auth, suppliers, filters }: SuppliersProps) {
  const [loading, setLoading] = useState(false)

  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'name',
      label: 'ຊື່ຊັບພາຍເອີ',
      sortable: true,
      render: (supplier: Supplier) => (
        <div className="flex items-center">
          <span className="relative inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
            {supplier.photo ? (
              <img 
                src={`/storage/suppliers/${supplier.photo}`} 
                alt={supplier.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-medium text-gray-600 dark:text-gray-300">
                {supplier.name.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{supplier.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{supplier.email}</div>
          </div>
        </div>
      )
    },
    {
      field: 'shopname',
      label: 'ຊື່ຮ້ານ',
      sortable: true
    },
    {
      field: 'phone',
      label: 'ເບີໂທລະສັບ',
      sortable: true
    },
    {
      field: 'type',
      label: 'ປະເພດ',
      sortable: true,
      render: (supplier: Supplier) => {
        let label = ''
        let badgeClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        
        if (supplier.type === 'distributor') {
          label = 'ຜູ້ຈັດຈຳນ່າຍ'
        } else if (supplier.type === 'wholesaler') {
          label = 'ຜູ້ຄ້າສົ່ງ'
          badgeClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        } else if (supplier.type === 'producer') {
          label = 'ຜູ້ຜະລິດ'
          badgeClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        }
        
        return <span className={badgeClass}>{label}</span>
      }
    },
    {
      field: 'actions',
      label: 'ຈັດການ',
      className: 'w-1',
      render: (supplier: Supplier) => (
        <div className="flex items-center space-x-2">
          <Link 
            href={route('suppliers.show', supplier.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ເບີ່ງ
          </Link>
          <Link 
            href={route('suppliers.edit', supplier.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ແກ້ໄຂ
          </Link>
          <button 
            onClick={() => handleDelete(supplier.id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
      route('suppliers.index'),
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
      route('suppliers.index'),
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
      route('suppliers.index'),
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
    if (confirm('ເຈົ້າແນ່ໃຈບໍ່ວ່າຈະລືບຊັບພາຍເອີນີ້?')) {
      router.delete(route('suppliers.destroy', id), {
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
        href={route('suppliers.create')}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
       ເພີ່ມຊັບພາຍເອີໃໝ່
      </Link>
      <Link 
        href={route('suppliers.create')}
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
    total: suppliers.total,
    currentPage: suppliers.current_page,
    perPage: suppliers.per_page,
    links: suppliers.links,
    from: suppliers.from,
    to: suppliers.to
  }

  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ຊັບພາຍເອີ', url: undefined }
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ຊັບພາຍເອີ</h2>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title="ຊັບພາຍເອີ" />
      
      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <DataTable
            data={suppliers.data}
            columns={columns}
            pagination={pagination}
            onSearch={handleSearch}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            sortField={filters.field}
            sortDirection={filters.direction}
            loading={loading}
            title="ລາຍການຊັບພາຍເອີ"
            actions={tableActions}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 