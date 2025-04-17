import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DataTable from '@/Components/Table/DataTable'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Supplier {
  id: number
  name: string
}

interface Purchase {
  id: number
  reference_no: string
  supplier_id: number
  purchase_date: string
  purchase_status: {
    value: number
    label: string
  }
  total_amount: number
  payment_status: {
    value: number
    label: string
  }
  supplier: Supplier
}

interface PurchasesProps extends PageProps {
  purchases: {
    data: Purchase[]
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

export default function Index({ auth, purchases, filters }: PurchasesProps) {
  const [loading, setLoading] = useState(false)

  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'reference_no',
      label: 'เลขที่อ้างอิง',
      sortable: true,
      render: (purchase: Purchase) => (
        <Link href={route('purchases.show', purchase.id)} className="text-blue-600 hover:text-blue-800 hover:underline">
          {purchase.reference_no}
        </Link>
      )
    },
    {
      field: 'supplier.name',
      label: 'ซัพพลายเออร์',
      sortable: true,
      render: (purchase: Purchase) => (
        <Link href={route('suppliers.show', purchase.supplier_id)} className="text-blue-600 hover:text-blue-800 hover:underline">
          {purchase.supplier.name}
        </Link>
      )
    },
    {
      field: 'date',
      label: 'วันที่',
      sortable: true,
      render: (purchase: Purchase) => (
        <span>{purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString('th-TH') : '-'}</span>
      )
    },
    {
      field: 'total_amount',
      label: 'ยอดรวม',
      sortable: true,
      render: (purchase: Purchase) => (
        <span>฿{(purchase.total_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
      )
    },
    {
      field: 'purchase_status',
      label: 'สถานะการสั่งซื้อ',
      sortable: true,
      render: (purchase: Purchase) => {
        // ตรวจสอบว่ามี purchase_status ที่เป็น object และมี value หรือไม่
        const statusValue = typeof purchase.purchase_status === 'object' && purchase.purchase_status !== null 
          ? purchase.purchase_status.value 
          : (typeof purchase.purchase_status === 'number' ? purchase.purchase_status : 0)
        
        // ดึงค่า label จาก object หรือกำหนดค่า default ตาม value
        const statusLabel = typeof purchase.purchase_status === 'object' && purchase.purchase_status !== null 
          ? purchase.purchase_status.label 
          : (statusValue === 0 ? 'รออนุมัติ' : 'อนุมัติแล้ว')
        
        const statusInfo = statusValue === 0 
          ? { classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100', label: statusLabel }
          : { classes: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100', label: statusLabel }
        
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${statusInfo.classes}`}>
            {statusInfo.label}
          </span>
        )
      }
    },
    {
      field: 'payment_status',
      label: 'สถานะการชำระเงิน',
      sortable: true,
      render: (purchase: Purchase) => {
        // ตรวจสอบว่ามี payment_status ที่เป็น object และมี value หรือไม่
        const paymentStatusValue = typeof purchase.payment_status === 'object' && purchase.payment_status !== null 
          ? purchase.payment_status.value 
          : (typeof purchase.payment_status === 'number' ? purchase.payment_status : 0)
        
        // ดึงค่า label จาก object หรือกำหนดค่า default ตาม value
        const paymentStatusLabel = typeof purchase.payment_status === 'object' && purchase.payment_status !== null 
          ? purchase.payment_status.label 
          : (paymentStatusValue === 0 ? 'ยังไม่ชำระ' : (paymentStatusValue === 1 ? 'ชำระบางส่วน' : 'ชำระแล้ว'))
        
        let statusInfo = {
          classes: '',
          label: paymentStatusLabel
        }
        
        switch (paymentStatusValue) {
          case 0: // ยังไม่ชำระ
            statusInfo.classes = 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            break
          case 1: // ชำระบางส่วน
            statusInfo.classes = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
            break
          case 2: // ชำระแล้ว
            statusInfo.classes = 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            break
        }
        
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${statusInfo.classes}`}>
            {statusInfo.label}
          </span>
        )
      }
    },
    {
      field: 'actions',
      label: 'จัดการ',
      className: 'w-1',
      render: (purchase: Purchase) => (
        <div className="flex space-x-2">
          <Link 
            href={route('purchases.show', purchase.id)} 
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            ดู
          </Link>
          {(typeof purchase.purchase_status === 'object' && purchase.purchase_status !== null
          ? purchase.purchase_status.value === 0
          : (typeof purchase.purchase_status === 'number' ? purchase.purchase_status === 0 : false)) && (
            <Link 
              href={route('purchases.edit', purchase.id)} 
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              แก้ไข
            </Link>
          )}
          <Link 
            href={route('purchases.print', purchase.id)} 
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-cyan-600 text-white hover:bg-cyan-700"
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
      route('purchases.index'),
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
      route('purchases.index'),
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
      route('purchases.index'),
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
        href={route('purchases.create')}
        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        สร้างรายการสั่งซื้อใหม่
      </Link>
    </>
  )

  // หน้าใหม่
  const tabs = (
    <div className="flex space-x-1 mb-4">
      <Link href={route('purchases.index')} className="px-3 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
        รายการทั้งหมด
      </Link>
      <Link href={route('purchases.pending')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300 border-b-2 border-transparent">
        รออนุมัติ
      </Link>
      <Link href={route('purchases.complete')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300 border-b-2 border-transparent">
        เสร็จสิ้น
      </Link>
      <Link href={route('purchases.due')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300 border-b-2 border-transparent">
        ค้างชำระ
      </Link>
    </div>
  )

  // การจัดรูปแบบข้อมูลการแบ่งหน้าสำหรับ DataTable
  const pagination = {
    total: purchases.total,
    currentPage: purchases.current_page,
    perPage: purchases.per_page,
    links: purchases.links,
    from: purchases.from,
    to: purchases.to
  }

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการสั่งซื้อสินค้าเข้า', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">รายการสั่งซื้อสินค้าเข้า</h2>
              </div>
              <div>
                {tableActions}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title="รายการสั่งซื้อสินค้าเข้า" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          {tabs}

          <DataTable
            data={purchases.data}
            columns={columns}
            pagination={pagination}
            onSearch={handleSearch}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            sortField={filters.field}
            sortDirection={filters.direction}
            loading={loading}
            title="รายการสั่งซื้อสินค้าเข้า"
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 