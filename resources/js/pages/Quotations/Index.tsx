import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DataTable from '@/Components/Table/DataTable'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Customer {
  id: number
  name: string
}

interface Quotation {
  id: number
  reference: string
  date: string
  customer_name: string
  total_amount: number
  status: number
  customer: Customer
}

interface QuotationsProps extends PageProps {
  quotations: {
    data: Quotation[]
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

export default function Index({ auth, quotations, filters }: QuotationsProps) {
  const [loading, setLoading] = useState(false)

  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'reference',
      label: 'ເລກທີ່ອ້າງອິງ',
      sortable: true
    },
    {
      field: 'date',
      label: 'ວັນທີ',
      sortable: true,
      render: (quotation: Quotation) => {
        const date = new Date(quotation.date)
        return date.toLocaleDateString('th-TH')
      }
    },
    {
      field: 'customer_name',
      label: 'ລູກຄ້າ',
      sortable: true
    },
    {
      field: 'total_amount',
      label: 'ຍອດລວມ',
      sortable: true,
      render: (quotation: Quotation) => (
        <span>₭{(quotation.total_amount / 100).toLocaleString('th-TH')}</span>
      )
    },
    {
      field: 'status',
      label: 'ສະຖານະ',
      sortable: true,
      render: (quotation: Quotation) => {
        let statusClass = ''
        let statusText = ''
        
        switch (quotation.status) {
          case 0:
            statusClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            statusText = 'ຮ່າງ'
            break
          case 1:
            statusClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
            statusText = 'ສົ່ງແລ້ວ'
            break
          case 2:
            statusClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            statusText = 'ຂາຍແລ້ວ'
            break
          case 3:
            statusClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            statusText = 'ຍົກເລີກ'
            break
          default:
            statusClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            statusText = 'ບໍ່ສະແດງ'
        }
        
        return <span className={statusClass}>{statusText}</span>
      }
    },
    {
      field: 'actions',
      label: 'ຈັດການ',
      className: 'w-1',
      render: (quotation: Quotation) => (
        <div className="flex items-center space-x-2">
          <Link 
            href={route('quotations.show', quotation.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ເບີ່ງ
          </Link>
          <Link 
            href={route('quotations.edit', quotation.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ແກ້ໄຂ
          </Link>
          <button 
            onClick={() => handleDelete(quotation.id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            ລືບ
          </button>
        </div>
      )
    }
  ]

  // จัดการค้นหา
  const handleSearch = (value: string) => {
    setLoading(true)
    router.get(
      route('quotations.index'),
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
      route('quotations.index'),
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
      route('quotations.index'),
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
    if (confirm('ເຈົ້າຕ້ອງການທີ່ຈະລືບໃບສະເໜີລາຄານີ້ບໍ່?')) {
      router.delete(route('quotations.destroy', id), {
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
        href={route('quotations.sales')}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          <path d="M7 6a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h5a1 1 0 100-2H8zM7 13a1 1 0 011-1h5a1 1 0 110 2H8a1 1 0 01-1-1z" />
        </svg>
        ໃບສະເໜີລາຄາທີ່ຂາຍແລ້ວ
      </Link>
      <Link 
        href={route('quotations.create')}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        ສ້າງໃບສະເໜີລາຄາໃໝ່
      </Link>
      <Link 
        href={route('quotations.create')}
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
    total: quotations.total,
    currentPage: quotations.current_page,
    perPage: quotations.per_page,
    links: quotations.links,
    from: quotations.from,
    to: quotations.to
  }

  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ໃບສະເໜີລາຄາ', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ລາຍການ</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ໃບສະເໜີລາຄາ</h2>
          </div>
        </div>
      }
    >
      <Head title="ໃບສະເໜີລາຄາ" />
      
      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <DataTable
            data={quotations.data}
            columns={columns}
            pagination={pagination}
            onSearch={handleSearch}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            sortField={filters.field}
            sortDirection={filters.direction}
            loading={loading}
            title="ລາຍການໃບສະເໜີລາຄາ"
            actions={tableActions}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 