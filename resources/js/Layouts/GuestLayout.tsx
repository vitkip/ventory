import { PropsWithChildren, useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'

export default function Guest({ children }: PropsWithChildren) {

  const [_, setDarkMode] = useState(false)

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
  }, [])

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-black">
      
      <div>
        <Link href="/" className="flex justify-center">
          <img src="/static/logo.svg" width="110" height="32" alt="IMS-Thai" />
        </Link>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        {/* BEGIN: Content */}
        {children}
        {/* END: Content */}
      </div>
      
    </div>
  )
} 