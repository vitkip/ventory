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

interface Order {
  id: number
  invoice_no: string
  customer_id: number
  order_date: string
  order_status: {
    value: number
    label: string
  }
  total_products: number
  sub_total: number
  vat: number
  total: number
  payment_type: string
  pay: number
  due: number
  customer: Customer
}

interface OrdersProps extends PageProps {
  orders: {
    data: Order[]
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

export default function Index({ auth, orders, filters }: OrdersProps) {
  const [loading, setLoading] = useState(false)

  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'invoice_no',
      label: 'เลขที่ใบสั่งซื้อ',
      sortable: true,
      render: (order: Order) => (
        <Link href={route('orders.show', order.id)} className="text-blue-600 hover:text-blue-800 hover:underline">
          {order.invoice_no}
        </Link>
      )
    },
    {
      field: 'customer.name',
      label: 'ลูกค้า',
      sortable: true,
      render: (order: Order) => (
        <Link href={route('customers.show', order.customer_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
          {order.customer.name}
        </Link>
      )
    },
    {
      field: 'order_date',
      label: 'วันที่',
      sortable: true,
      render: (order: Order) => (
        <span>{new Date(order.order_date).toLocaleDateString('th-TH')}</span>
      )
    },
    {
      field: 'total_products',
      label: 'รายการ',
      sortable: true
    },
    {
      field: 'total',
      label: 'ยอดรวม',
      sortable: true,
      render: (order: Order) => (
        <span>฿{(order.total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
      )
    },
    {
      field: 'order_status',
      label: 'สถานะ',
      sortable: true,
      render: (order: Order) => {
        // ตรวจสอบว่า order_status มาในรูปแบบไหน
        const orderStatusValue = typeof order.order_status === 'object' 
          ? order.order_status.value 
          : order.order_status;
        
        // กำหนดข้อความและสีตามค่าสถานะ
        let statusInfo = {
          classes: '',
          label: ''
        };
        
        if (orderStatusValue === 0) {
          statusInfo = {
            classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
            label: 'รออนุมัติ'
          };
        } else if (orderStatusValue === 1) {
          statusInfo = {
            classes: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
            label: 'เสร็จสิ้น'
          };
        } else if (orderStatusValue === 2) {
          statusInfo = {
            classes: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
            label: 'ยกเลิก'
          };
        }
        
        // ใช้ label จาก API ถ้ามี 
        if (typeof order.order_status === 'object' && order.order_status.label) {
          statusInfo.label = order.order_status.label;
        }
        
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${statusInfo.classes}`}>
            {statusInfo.label}
          </span>
        );
      }
    },
    {
      field: 'actions',
      label: 'จัดการ',
      className: 'w-1',
      render: (order: Order) => (
        <div className="flex space-x-2">
          <Link 
            href={route('orders.show', order.id)} 
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            ดู
          </Link>
          <Link 
            href={route('orders.invoice.download', order.id)} 
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-700 dark:text-indigo-100 dark:hover:bg-indigo-600"
            target="_blank"
          >
            พิมพ์
          </Link>
        </div>
      )
    }
  ]

  // จัดการค้นหา
  const handleSearch = (value: string) => {
    setLoading(true)
    router.get(
      route('orders.index'),
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
      route('orders.index'),
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
      route('orders.index'),
      { ...filters, field, direction },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => setLoading(false)
      }
    )
  }

  // ปุ่มสำหรับใส่ใน actions ของ DataTable
  const tableActions = (
    <>
      <Link 
        href={route('orders.create')}
        className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        สร้างคำสั่งซื้อใหม่
      </Link>
      <Link 
        href={route('orders.create')}
        className="sm:hidden inline-flex items-center p-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </>
  )

  // หน้าใหม่
  const tabs = (
    <div className="flex space-x-2 mt-4 mb-6">
      <Link 
        href={route('orders.index')} 
        className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        รายการทั้งหมด
      </Link>
      <Link 
        href={route('orders.pending')} 
        className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        รออนุมัติ
      </Link>
      <Link 
        href={route('orders.complete')} 
        className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        เสร็จสิ้น
      </Link>
      <Link 
        href={route('due.index')} 
        className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        ค้างชำระ
      </Link>
    </div>
  )

  // การจัดรูปแบบข้อมูลการแบ่งหน้าสำหรับ DataTable
  const pagination = {
    total: orders.total,
    currentPage: orders.current_page,
    perPage: orders.per_page,
    links: orders.links,
    from: orders.from,
    to: orders.to
  }

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการสั่งซื้อ', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">รายการ</div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">รายการสั่งซื้อ</h1>
          </div>
        </div>
      }
    >
      <Head title="รายการสั่งซื้อ" />
      
      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          {tabs}

          <DataTable
            data={orders.data}
            columns={columns}
            pagination={pagination}
            onSearch={handleSearch}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            sortField={filters.field}
            sortDirection={filters.direction}
            loading={loading}
            title="รายการคำสั่งซื้อ"
            actions={tableActions}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 