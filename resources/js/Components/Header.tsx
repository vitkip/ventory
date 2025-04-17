import { User } from '@/types'
import { Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'

type HeaderProps = {
  user: User
  darkMode: boolean
  setDarkMode: (mode: boolean) => void
}

export default function Header({ user, darkMode, setDarkMode }: HeaderProps) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 p-4 w-full z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          {/* Left side */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/dashboard" className="flex items-center">
                <img src="/static/logo.svg" width="110" height="32" alt="IMS-Thai" className="h-8" />
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
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

            {/* Mobile search */}
            <div className="relative block sm:hidden">
              <div className="flex items-center p-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full">
                <button className="p-1 text-gray-500 dark:text-gray-400 rounded-full hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center p-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              >
                <div className="w-4 h-4 overflow-hidden rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <div className="flex items-center justify-center w-full h-full text-xl font-bold text-yellow-800 dark:text-yellow-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className="mx-2 font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 z-10 w-48 py-1 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                  <Link
                    href={route('profile.edit')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ໂປຣໄຟລ໌
                  </Link>
                  <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    type="button"
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ອອກຈາກລະບົບ
                  </Link>
                </div>
              )}
            </div>

            {/* Hamburger Button */}
            <button
              className="p-2 ml-2 text-gray-500 dark:text-gray-400 rounded-md lg:hidden hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
            >
              <span className="sr-only">ເປີດເມນູ</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
          </div>
        </div>
      </div>
    </nav>
  )
} 