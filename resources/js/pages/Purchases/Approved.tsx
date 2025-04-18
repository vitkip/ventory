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

interface ApprovedProps extends PageProps {
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

export default function Approved({ auth, purchases, filters }: ApprovedProps) {
  const [loading, setLoading] = useState(false)

  // คอลัมน์ตาราง
  const columns = [
    {
      field: 'reference_no',
      label: 'ເລກທີ່ອ້າງອິງ',
      sortable: true,
      render: (purchase: Purchase) => (
        <Link 
          href={route('purchases.show', purchase.id)} 
          className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        >
          {purchase.reference_no}
        </Link>
      )
    },
    {
      field: 'supplier.name',
      label: 'ຊັບພາຍເອີ',
      sortable: true,
      render: (purchase: Purchase) => (
        <Link 
          href={route('suppliers.show', purchase.supplier_id)} 
          className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        >
          {purchase.supplier.name}
        </Link>
      )
    },
    {
      field: 'date',
      label: 'ວັນທີ',
      sortable: true,
      render: (purchase: Purchase) => (
        <span>{purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString('th-TH') : '-'}</span>
      )
    },
    {
      field: 'total_amount',
      label: 'ຍອດລວມ',
      sortable: true,
      render: (purchase: Purchase) => (
        <span>₭{(purchase.total_amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
      )
    },
    {
      field: 'payment_status',
      label: 'ສະຖານະການຈ່າຍເງີນ',
      sortable: true,
      render: (purchase: Purchase) => {
        let statusClass
        let statusValue
        let statusLabel

        // ตรวจสอบว่า payment_status เป็น object ที่มี value และ label หรือเป็นเพียงค่าตัวเลข
        if (typeof purchase.payment_status === 'object' && purchase.payment_status !== null) {
          statusValue = purchase.payment_status.value
          statusLabel = purchase.payment_status.label
        } else {
          // ถ้าเป็นตัวเลขโดยตรง
          statusValue = purchase.payment_status
          
          // กำหนดค่า label ตามสถานะ
          switch (statusValue) {
            case 0:
              statusLabel = 'ຍັງບໍ່ໄດ້ຈ່າຍ'
              break
            case 1:
              statusLabel = 'ຈ່າຍບາງສ່ວນ'
              break
            case 2:
              statusLabel = 'ຈ່າຍແລ້ວ'
              break
            default:
              statusLabel = 'ບໍ່ຮູສະຖານະ'
          }
        }
        
        switch (statusValue) {
          case 0: // ยังไม่ชำระ
            statusClass = 'inline-flex px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            break
          case 1: // ชำระบางส่วน
            statusClass = 'inline-flex px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
            break
          case 2: // ชำระแล้ว
            statusClass = 'inline-flex px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            break
          default:
            statusClass = 'inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
        }
        
        return <span className={statusClass}>{statusLabel}</span>
      }
    },
    {
      field: 'actions',
      label: 'ຈັດການ',
      className: 'w-1',
      render: (purchase: Purchase) => (
        <div className="flex space-x-2">
          <Link 
            href={route('purchases.show', purchase.id)} 
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            ເບີ່ງ
          </Link>
          <Link 
            href={route('purchases.print', purchase.id)} 
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            target="_blank"
          >
            ພິມ
          </Link>
        </div>
      )
    }
  ]

  // จัดการค้นหา
  const handleSearch = (value: string) => {
    setLoading(true)
    router.get(
      route('purchases.approvedPurchases'),
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
      route('purchases.approvedPurchases'),
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
      route('purchases.approvedPurchases'),
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
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
      <Link 
        href={route('purchases.index')} 
        className="py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-b-2 border-transparent"
      >
        ລາຍການລວມທັງໝົດ
      </Link>
      <Link 
        href={route('purchases.approvedPurchases')} 
        className="py-4 px-6 text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
      >
        ລາຍການທີ່ຖ້າອະນຸຍາດ
      </Link>
      <Link 
        href={route('purchases.dailyPurchaseReport')} 
        className="py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-b-2 border-transparent"
      >
        ລາຍງານປະຈຳວັນ
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
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ລາຍການສັ່ງຊື້', url: route('purchases.index') },
    { title: 'ລາຍການທີ່ອະນຸຍາດແລ້ວ', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ລະບົບຈັດການ</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">ລາຍການສັ່ງຊື້ທີ່ອະນຸຍາດແລ້ວ</h2>
          </div>
        </div>
      }
    >
      <Head title="ລາຍການສັ່ງຊື້ທີ່ອະນຸຍາດແລ້ວ" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          {tabs}
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
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
              title="ລາຍການສັ່ງຊື້ທີ່ອະນຸຍາດແລ້ວ"
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 