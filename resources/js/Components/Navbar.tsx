import { Link } from '@inertiajs/react'
import { useState } from 'react'

export default function Navbar() {
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false)
  const [purchasesDropdownOpen, setPurchasesDropdownOpen] = useState(false)
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false)
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // ฟังก์ชั่นปิด dropdown อื่นๆ ยกเว้นที่เลือก
  const closeOtherDropdowns = (current: string) => {
    if (current !== 'orders') setOrdersDropdownOpen(false)
    if (current !== 'purchases') setPurchasesDropdownOpen(false)
    if (current !== 'settings') setSettingsDropdownOpen(false)
    if (current !== 'pages') setPagesDropdownOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="fixed top-0 right-0 z-50 p-4 sm:hidden">
        <button
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span className="sr-only">ເປີດເມນູຫຼັກ</span>
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:block mt-16">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              {/* Main Navigation */}
              <div className="flex items-center">
                <Link 
                  href={route('dashboard')} 
                  className={`inline-flex items-center h-14 px-4 text-sm font-medium border-b-2 ${
                    route().current('dashboard') 
                      ? 'text-blue-600 dark:text-blue-400 border-blue-500' 
                      : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                    </svg>
                    ແດດບອດ
                  </span>
                </Link>

                <Link 
                  href={route('products.index')} 
                  className={`inline-flex items-center h-14 px-4 text-sm font-medium border-b-2 ${
                    route().current('products.*') 
                      ? 'text-blue-600 dark:text-blue-400 border-blue-500' 
                      : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" />
                      <path d="M12 13.5l5 -3l5 3v5.5l-5 3l-5 -3" />
                      <path d="M7 10.5l5 -3l5 3l-5 3z" />
                    </svg>
                    ສິນຄ້າ  
                  </span>
                </Link>

                {/* Orders Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setOrdersDropdownOpen(!ordersDropdownOpen)
                      closeOtherDropdowns('orders')
                    }}
                    className={`inline-flex items-center h-14 px-4 text-sm font-medium border-b-2 ${
                      route().current('orders.*') 
                        ? 'text-blue-600 dark:text-blue-400 border-blue-500' 
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M7 10l5 -6l5 6" />
                        <path d="M21 10l-2 8a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l-2 -8z" />
                        <path d="M12 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      </svg>
                      ຄໍາສັ່ງຊື້
                    </span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {ordersDropdownOpen && (
                    <div className="absolute left-0 z-10 w-48 py-1 mt-0 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                      <Link href={route('orders.index')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ທັງໝົດ
                      </Link>
                      <Link href={route('orders.complete')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ສຳເລັດ
                      </Link>
                      <Link href={route('orders.pending')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ຖ້າດຳເນິນການ
                      </Link>
                      <Link href={route('due.index')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ຄ້າງຊຳລະ
                      </Link>
                    </div>
                  )}
                </div>

                {/* Purchases Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setPurchasesDropdownOpen(!purchasesDropdownOpen)
                      closeOtherDropdowns('purchases')
                    }}
                    className={`inline-flex items-center h-14 px-4 text-sm font-medium border-b-2 ${
                      route().current('purchases.*') 
                        ? 'text-blue-600 dark:text-blue-400 border-blue-500' 
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                        <path d="M3 10h18" />
                        <path d="M7 15h.01" />
                        <path d="M11 15h2" />
                      </svg>
                      ການສັ່ງຊື້
                    </span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {purchasesDropdownOpen && (
                    <div className="absolute left-0 z-10 w-48 py-1 mt-0 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                      <Link href={route('purchases.index')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ທັງໝົດ
                      </Link>
                      <Link href={route('purchases.approvedPurchases')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ອະນຸມັດ
                      </Link>
                      <Link href={route('purchases.dailyPurchaseReport')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ລາຍການຊື້ປະຈຳວັນ
                      </Link>
                    </div>
                  )}
                </div>

                <Link 
                  href={route('quotations.index')} 
                  className={`inline-flex items-center h-14 px-4 text-sm font-medium border-b-2 ${
                    route().current('quotations.*') 
                      ? 'text-blue-600 dark:text-blue-400 border-blue-500' 
                      : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                      <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                      <path d="M9 12h6" />
                      <path d="M9 16h6" />
                    </svg>
                    ໃບສະເໜີລາຄາ
                  </span>
                </Link>
                
                {/* Pages Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setPagesDropdownOpen(!pagesDropdownOpen)
                      closeOtherDropdowns('pages')
                    }}
                    className={`inline-flex items-center h-14 px-4 text-sm font-medium border-b-2 ${
                      route().current('suppliers.*') || route().current('customers.*')
                        ? 'text-blue-600 dark:text-blue-400 border-blue-500' 
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                        <path d="M16 16v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h2" />
                      </svg>
                      ເພສ
                    </span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {pagesDropdownOpen && (
                    <div className="absolute left-0 z-10 w-48 py-1 mt-0 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                      <Link href={route('suppliers.index')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ສັບພາຍເອີ
                      </Link>
                      <Link href={route('customers.index')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ລູກຄ້າ  
                      </Link>
                    </div>
                  )}
                </div>

                {/* Settings Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setSettingsDropdownOpen(!settingsDropdownOpen)
                      closeOtherDropdowns('settings')
                    }}
                    className={`inline-flex items-center h-14 px-4 text-sm font-medium border-b-2 ${
                      route().current('users.*') || route().current('categories.*') || route().current('units.*')
                        ? 'text-blue-600 dark:text-blue-400 border-blue-500' 
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                      </svg>
                      ຕັ້ງຄ່າ
                    </span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {settingsDropdownOpen && (
                    <div className="absolute left-0 z-10 w-48 py-1 mt-0 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                      <Link href={route('users.index')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ຜູ້ໃຊ້
                      </Link>
                      <Link href={route('categories.index')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ໝວດໝູ່
                      </Link>
                      <Link href={route('units.index')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ຫົວໜ່ວຍ
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`sm:hidden bg-white dark:bg-gray-800 shadow-lg rounded-b-lg mt-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-16 pb-3 space-y-1">
          {/* Mobile Quick Access */}
          <div className="grid grid-cols-4 gap-2 p-2 mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Link href={route('dashboard')} className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">ໜ້າຫຼັກ</span>
            </Link>
            
            <Link href={route('products.index')} className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-xs">ສິນຄ້າ</span>
            </Link>
            
            <Link href={route('orders.index')} className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs">ຄໍາສັ່ງຊື້</span>
            </Link>
            
            <Link href={route('purchases.index')} className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs">ການຊື້</span>
            </Link>
          </div>

          {/* Mobile menu links */}
          <Link
            href={route('dashboard')}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              route().current('dashboard')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            ແດດບອດ
          </Link>

          <Link
            href={route('products.index')}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              route().current('products.*')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            ສິນຄ້າ
          </Link>

          {/* Mobile Orders submenu */}
          <div>
            <button
              onClick={() => {
                setOrdersDropdownOpen(!ordersDropdownOpen)
                closeOtherDropdowns('orders')
              }}
              className={`flex justify-between w-full px-3 py-2 text-base font-medium rounded-md ${
                route().current('orders.*')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M7 10l5 -6l5 6" />
                  <path d="M21 10l-2 8a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l-2 -8z" />
                  <path d="M12 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                </svg>
                ຄຳສັ່ງຊື້
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${ordersDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {ordersDropdownOpen && (
              <div className="px-3 py-2 mt-1 space-y-1 bg-gray-50 dark:bg-gray-700 rounded-md">
                <Link
                  href={route('orders.index')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ທັງໝົດ
                </Link>
                <Link
                  href={route('orders.complete')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ສຳເລັດ
                </Link>
                <Link
                  href={route('orders.pending')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ຖ້າດຳເນິນການ
                </Link>
                <Link
                  href={route('due.index')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ຄ້າງຊຳລະ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Purchases submenu */}
          <div>
            <button
              onClick={() => {
                setPurchasesDropdownOpen(!purchasesDropdownOpen)
                closeOtherDropdowns('purchases')
              }}
              className={`flex justify-between w-full px-3 py-2 text-base font-medium rounded-md ${
                route().current('purchases.*')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                  <path d="M3 10h18" />
                  <path d="M7 15h.01" />
                  <path d="M11 15h2" />
                </svg>
                ການຊື້
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${purchasesDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {purchasesDropdownOpen && (
              <div className="px-3 py-2 mt-1 space-y-1 bg-gray-50 dark:bg-gray-700 rounded-md">
                <Link
                  href={route('purchases.index')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ທັງໝົດ
                </Link>
                <Link
                  href={route('purchases.approvedPurchases')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ອະນຸມັດ
                </Link>
                <Link
                  href={route('purchases.dailyPurchaseReport')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ລາຍງານການຊື້ປະຈຳວັນ
                </Link>
              </div>
            )}
          </div>

          <Link
            href={route('quotations.index')}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              route().current('quotations.*')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            ໃບສະເໜີລາຄາ
          </Link>

          {/* Mobile Pages submenu */}
          <div>
            <button
              onClick={() => {
                setPagesDropdownOpen(!pagesDropdownOpen)
                closeOtherDropdowns('pages')
              }}
              className={`flex justify-between w-full px-3 py-2 text-base font-medium rounded-md ${
                route().current('suppliers.*') || route().current('customers.*')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M8 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                  <path d="M16 16v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h2" />
                </svg>
                ເພສ
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${pagesDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {pagesDropdownOpen && (
              <div className="px-3 py-2 mt-1 space-y-1 bg-gray-50 dark:bg-gray-700 rounded-md">
                <Link
                  href={route('suppliers.index')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ຊັບພາຍເອີ
                </Link>
                <Link
                  href={route('customers.index')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ລູກຄ້າ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Settings submenu */}
          <div>
            <button
              onClick={() => {
                setSettingsDropdownOpen(!settingsDropdownOpen)
                closeOtherDropdowns('settings')
              }}
              className={`flex justify-between w-full px-3 py-2 text-base font-medium rounded-md ${
                route().current('users.*') || route().current('categories.*') || route().current('units.*')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                </svg>
                ຕັ້ງຄ່າ
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${settingsDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {settingsDropdownOpen && (
              <div className="px-3 py-2 mt-1 space-y-1 bg-gray-50 dark:bg-gray-700 rounded-md">
                <Link
                  href={route('users.index')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ຜູ້ໃຊ້
                </Link>
                <Link
                  href={route('categories.index')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ໝວດໝູ່
                </Link>
                <Link
                  href={route('units.index')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  ຫົວໜ່ວຍ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 