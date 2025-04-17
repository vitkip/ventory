import React, { useState, useEffect } from 'react'
import { Link, Head } from '@inertiajs/react'

interface WelcomeProps {
  auth: {
    user: any
  }
}

export default function Welcome({ auth }: WelcomeProps) {

  // สร้างตัวแปรสำหรับกำหนด dark mode
  const [darkMode, setDarkMode] = useState(false)

  // เพิ่ม dark mode
  useEffect(() => {
    // ตรวจสอบ system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const savedDarkMode = localStorage.getItem('darkMode')

    // ถ้ามีค่าใน localStorage ให้ใช้ค่านั้น ไม่งั้นใช้ค่า system preference
    const isDarkMode = savedDarkMode !== null ? savedDarkMode === 'true' : prefersDarkMode
    setDarkMode(isDarkMode)
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  // ฟังก์ชันสำหรับเปลี่ยน mode เป็น dark/light
  const toggleDarkMode = () => {

    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    // บันทึกลง localStorage
    localStorage.setItem('darkMode', String(newDarkMode))
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

  }

  return (
    <>
      <Head>
          <title>ຍິນດີຕອນຮັບ</title>
          <meta name="description" content="Welcome page description" />
      </Head>
        
      <div className="bg-white dark:bg-black text-gray-800 dark:text-gray-200 min-h-screen">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 p-4 w-full z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between max-w-6xl mx-auto">
            <div className="flex items-center">
              <Link href={route('welcome')} className="flex items-center gap-2">
                <img src="/static/logo.svg" width="110" height="32" alt="IMS-Thai" className="h-8" />
              </Link>
            </div>
            
            <div className="flex items-center gap-2">

                {/* ลิงก์เข้าสู่ระบบ/ลงทะเบียน */}
                <div className="flex items-center gap-2">
                {auth.user ? (
                <Link
                    href={route('dashboard')}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  ແດດບອດ
                </Link>
                ) : (
                <>
                    <Link
                    href={route('login')}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                    ເຂົ້າສູ່ລະບົບ
                    </Link>
                    <Link
                        href={route('register')}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-md transition-colors"
                    >
                      ລົງທະບຽນ
                    </Link>
                </>
                )}
                </div>
                
              {/* Dark mode toggle */}
              <button 
                onClick={toggleDarkMode}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                aria-label={darkMode ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="mt-16 flex flex-col items-center">
            {/* Technology Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Laravel</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  ແຟຣມແລະຊຸດເຄື່ອງມື PHP ສໍາລັບສໍານວນແບບແນວໃໝ່
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Inertia.js</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  ເຊື່ອມຕໍ່ລາຍການລະບົບໃນແອັບ ສໍາລັບ React ແລະ Laravel
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="4"></circle>
                    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">React</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                 ໄລບຣາຣີ JavaScript ສໍາລັບສໍານວນ UI ທີ່ແບບໃໝ່                
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-20 w-full max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
               ຄຸນສົມບັດສໍາຄັນ           
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">จัดการสินค้า</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                       ບໍລິຫານສິນຄ້າ ແລະບັນທຶກຂໍໍານວນໃນສະຖານທີ່ແຕ່ລະແບນ
                       
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">ລາຍງານສະຫຼຸບ</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                       ເບີ່ງລາຍງານສະຖານະສິນຄ້າ ແລະຂໍໍານວນໃນສະຖານທີ່
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mb-0 py-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ພັດທະນາໂດຍ <span className="text-red-500">♥</span> ໂດຍ Bitkip
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                © {new Date().getFullYear()} IMS. ສະຫງວນລິຂະສິດ
              </p>
            </div>
          </div>
        </footer>
      </div>
        
    </>
  )
}