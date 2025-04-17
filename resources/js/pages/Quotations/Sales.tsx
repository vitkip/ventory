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
  order_id?: number
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

export default function Sales({ auth, quotations, filters }: QuotationsProps) {
  const [loading, setLoading] = useState(false)

  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'reference',
      label: 'เลขที่อ้างอิง',
      sortable: true
    },
    {
      field: 'date',
      label: 'วันที่',
      sortable: true,
      render: (quotation: Quotation) => {
        const date = new Date(quotation.date)
        return date.toLocaleDateString('th-TH')
      }
    },
    {
      field: 'customer_name',
      label: 'ลูกค้า',
      sortable: true
    },
    {
      field: 'total_amount',
      label: 'ยอดรวม',
      sortable: true,
      render: (quotation: Quotation) => (
        <span>฿{(quotation.total_amount / 100).toLocaleString('th-TH')}</span>
      )
    },
    {
      field: 'actions',
      label: 'จัดการ',
      className: 'w-1',
      render: (quotation: Quotation) => (
        <div className="flex items-center space-x-2">
          <Link 
            href={route('quotations.show', quotation.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ดูใบเสนอราคา
          </Link>
          {quotation.order_id && (
            <Link 
              href={route('orders.show', quotation.order_id)} 
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              ดูออเดอร์
            </Link>
          )}
        </div>
      )
    }
  ]

  // จัดการค้นหา
  const handleSearch = (value: string) => {
    setLoading(true)
    router.get(
      route('quotations.sales'),
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
      route('quotations.sales'),
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
      route('quotations.sales'),
      { ...filters, field, direction },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => setLoading(false)
      }
    )
  }

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
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'ใบเสนอราคา', url: route('quotations.index') },
    { title: 'ใบเสนอราคาที่ขายแล้ว', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">รายการ</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ใบเสนอราคาที่ขายแล้ว</h2>
          </div>
        </div>
      }
    >
      <Head title="ใบเสนอราคาที่ขายแล้ว" />
      
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
            title="รายการใบเสนอราคาที่ขายแล้ว"
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 