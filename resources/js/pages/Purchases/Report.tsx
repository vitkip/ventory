import React, { FormEvent, useEffect, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Supplier {
  id: number
  name: string
}

interface FormData {
  start_date: string
  end_date: string
  supplier_id: string
  status: string
  payment_status: string
}

interface ReportProps extends PageProps {
  suppliers: Supplier[]
  start_date?: string
  end_date?: string
  selected_supplier?: number
  selected_status?: number
  selected_payment_status?: number
}

export default function Report({
  auth,
  suppliers,
  start_date,
  end_date,
  selected_supplier,
  selected_status,
  selected_payment_status
}: ReportProps) {
  const today = new Date().toISOString().slice(0, 10)
  
  const [formData, setFormData] = useState<FormData>({
    start_date: start_date || today,
    end_date: end_date || today,
    supplier_id: selected_supplier ? selected_supplier.toString() : '',
    status: selected_status !== undefined ? selected_status.toString() : '',
    payment_status: selected_payment_status !== undefined ? selected_payment_status.toString() : ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (formData.start_date) params.append('start_date', formData.start_date)
    if (formData.end_date) params.append('end_date', formData.end_date)
    if (formData.supplier_id) params.append('supplier_id', formData.supplier_id)
    if (formData.status) params.append('status', formData.status)
    if (formData.payment_status) params.append('payment_status', formData.payment_status)
    
    router.get(`${route('purchases.getPurchaseReport')}?${params.toString()}`)
  }

  const handleExport = () => {
    const params = new URLSearchParams()
    
    if (formData.start_date) params.append('start_date', formData.start_date)
    if (formData.end_date) params.append('end_date', formData.end_date)
    if (formData.supplier_id) params.append('supplier_id', formData.supplier_id)
    if (formData.status) params.append('status', formData.status)
    if (formData.payment_status) params.append('payment_status', formData.payment_status)
    
    // เปิดในแท็บใหม่
    window.open(`${route('purchases.exportPurchaseReport')}?${params.toString()}`, '_blank')
  }

  const tabs = (
    <div className="flex space-x-1 mb-4">
      <Link href={route('purchases.index')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300  border-transparent">
        รายการทั้งหมด
      </Link>
      <Link href={route('purchases.approvedPurchases')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300  border-transparent">
        รายการที่อนุมัติแล้ว
      </Link>
      <Link href={route('purchases.dailyPurchaseReport')} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:border-gray-300 border-transparent">
        รายงานประจำวัน
      </Link>
      <Link href={route('purchases.getPurchaseReport')} className="px-3 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
        ออกรายงาน
      </Link>
    </div>
  )

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการสั่งซื้อ', url: route('purchases.index') },
    { title: 'ออกรายงาน', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">ออกรายงานการสั่งซื้อ</h2>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title="ออกรายงานการสั่งซื้อ" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          {tabs}
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      วันที่เริ่มต้น
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      วันที่สิ้นสุด
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ซัพพลายเออร์
                    </label>
                    <select
                      id="supplier_id"
                      name="supplier_id"
                      value={formData.supplier_id}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">ทั้งหมด</option>
                      {suppliers && suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      สถานะคำสั่งซื้อ
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="0">รออนุมัติ</option>
                      <option value="1">อนุมัติแล้ว</option>
                      <option value="2">ยกเลิก</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      สถานะการชำระเงิน
                    </label>
                    <select
                      id="payment_status"
                      name="payment_status"
                      value={formData.payment_status}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="0">ยังไม่ชำระ</option>
                      <option value="1">ชำระบางส่วน</option>
                      <option value="2">ชำระแล้ว</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                          <path d="M21 21l-6 -6" />
                        </svg>
                        ค้นหา
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleExport}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                          <path d="M7 11l5 5l5 -5" />
                          <path d="M12 4l0 12" />
                        </svg>
                        ส่งออกรายงาน
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 