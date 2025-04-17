import { useState, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

// นำเข้า ApexCharts
declare global {
  interface Window {
    ApexCharts: any
  }
}

interface DashboardProps extends PageProps {
  products: number
  orders: number
  completedOrders: number
  purchases: number
  todayPurchases: number
  categories: number
  quotations: number
  todayQuotations: number
  chartDates: string[]
  orderData: number[]
  purchaseData: number[]
}

export default function Dashboard({
  auth,
  products = 0,
  orders = 0,
  completedOrders = 0,
  purchases = 0,
  todayPurchases = 0,
  categories = 0,
  quotations = 0,
  todayQuotations = 0,
  chartDates = [],
  orderData = [],
  purchaseData = []
}: DashboardProps) {

  // สร้างกราฟ ApexCharts เมื่อ Component ถูกโหลด
  useEffect(() => {

    // สร้างฟังก์ชันสำหรับโหลด ApexCharts
    const loadApexCharts = () => {
      const script = document.createElement('script')
      script.src = '/dist/libs/apexcharts/dist/apexcharts.min.js'
      script.async = true
      script.onload = initializeChart
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }

    // ฟังก์ชันเริ่มต้นกราฟเมื่อ ApexCharts ถูกโหลด
    const initializeChart = () => {
    if (window.ApexCharts && chartDates && chartDates.length > 0) {
      console.log('Initializing ApexCharts', { chartDates, orderData, purchaseData })
      
      const options = {
        series: [{
          name: 'คำสั่งซื้อ',
          data: orderData || []
        }, {
          name: 'สั่งซื้อสินค้า',
          data: purchaseData || []
        }],
        chart: {
          type: 'area',
          height: 300,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          type: 'datetime',
          categories: chartDates || []
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          }
        },
        colors: ['#206bc4', '#4299e1'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
          }
        }
      }

      const chartElement = document.getElementById('orders-chart')
      if (chartElement) {
        // เคลียร์เนื้อหาเดิมในกรณีที่มีกราฟอยู่แล้ว
        chartElement.innerHTML = ''
        const chart = new window.ApexCharts(chartElement, options)
        chart.render()
      }
    }
    }

    // ตรวจสอบว่า ApexCharts ถูกโหลดแล้วหรือไม่
    if (typeof window !== 'undefined') {
      if (window.ApexCharts) {
        initializeChart()
      } else {
        return loadApexCharts()
      }
    }

  }, [chartDates, orderData, purchaseData])


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ພາບລວມ
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ແດດບອດ
                </h2>
              </div>
              <div className="flex space-x-3">
                <Link
                  // href={route('orders.create')}
                  href=""
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  ສ້າງຄຳສັ່ງຊື້ໃໝ່
                </Link>
                <Link
                  // href={route('orders.create')}
                    href=""
                  className="sm:hidden inline-flex items-center p-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Head title="แดชบอร์ด" />
      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* สินค้าและหมวดหมู่ */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {products} ສິນຄ້າ
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {categories} ໝວດໝູ່
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* คำสั่งซื้อ */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {orders} ຄໍາສັ່ງຊື້
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {completedOrders} ສຳເລັດ
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* สั่งซื้อสินค้า */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {purchases} ສັ່ງຊື້
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {todayPurchases} ມື້ນີ້
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ใบเสนอราคา */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {quotations} ໃບສະເໜີລາຄາ
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {todayQuotations} ມື້ນີ້
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* กราฟแสดงสถิติ */}
          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  ສະຖິຕິຄໍາສັ່ງຊື້ ແລະ ສັ່ງຊື້
                </h3>
                <div id="orders-chart" className="h-[300px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}