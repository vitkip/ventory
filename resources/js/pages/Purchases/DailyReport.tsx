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
  total_amount: number
  paid_amount: number
  due_amount: number
  purchase_status: {
    value: number
    label: string
  }
  payment_status: {
    value: number
    label: string
  }
  supplier: Supplier
}

interface DailyReportProps extends PageProps {
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
  today: string
  total_amount: number
}

export default function DailyReport({ auth, purchases, filters, today, total_amount }: DailyReportProps) {
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
      field: 'purchase_date',
      label: 'วันที่ซื้อ',
      sortable: true,
      render: (purchase: Purchase) => {
        // ตรวจสอบว่ามี purchase_date หรือไม่ ถ้าไม่มีให้ดูว่ามี date หรือไม่ด้วย optional chaining
        const purchaseDate = purchase.purchase_date || (purchase as any).date;
        if (!purchaseDate) {
          return <span>-</span>
        }
        return (
          <span>{new Date(purchaseDate).toLocaleDateString('th-TH')}</span>
        )
      }
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
      route('purchases.dailyPurchaseReport'),
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
      route('purchases.dailyPurchaseReport'),
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
      route('purchases.dailyPurchaseReport'),
      { ...filters, field, direction },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => setLoading(false)
      }
    )
  }

  // หน้าใหม่
  const tabs = (
    <div className="flex space-x-1 mb-4">
      <Link href={route('purchases.index')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300 border-b-2 border-transparent">
        รายการทั้งหมด
      </Link>
      <Link href={route('purchases.approvedPurchases')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300 border-b-2 border-transparent">
        รายการที่อนุมัติแล้ว
      </Link>
      <Link href={route('purchases.dailyPurchaseReport')} className="px-3 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
        รายงานประจำวัน
      </Link>
      <Link href={route('purchases.getPurchaseReport')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300 border-b-2 border-transparent">
        ออกรายงาน
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
    { title: 'รายการสั่งซื้อ', url: route('purchases.index') },
    { title: 'รายงานประจำวัน', url: undefined }
  ]

  // สร้างปุ่มสำหรับส่วนหัว
  const tableActions = (
    <Link 
      href={route('purchases.getPurchaseReport')}
      className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <path d="M7 11l5 5l5 -5" />
        <path d="M12 4l0 12" />
      </svg>
      ออกรายงาน
    </Link>
  )

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">รายงานการสั่งซื้อประจำวัน</h2>
              </div>
              <div>
                {tableActions}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title="รายงานการสั่งซื้อประจำวัน" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          {tabs}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">วันที่</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(today).toLocaleDateString('th-TH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ยอดรวมการสั่งซื้อวันนี้</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    ฿{(total_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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
            title={`รายงานการสั่งซื้อประจำวันที่ ${new Date(today).toLocaleDateString('th-TH')}`}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 