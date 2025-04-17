import { PropsWithChildren, ReactNode, useState, useEffect } from 'react'
import { User } from '@/types'
import { Link } from '@inertiajs/react'
import Header from '@/Components/Header'
import Navbar from '@/Components/Navbar'
import Footer from '@/Components/Footer'

export default function Authenticated({
  user,
  header,
  children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header bar with user menu */}
      <Header user={user} darkMode={darkMode} setDarkMode={setDarkMode} />
      
      {/* Navigation bar */}
      <Navbar />

      {/* Page Content */}
      <main className="py-16">
        <div className="px-4 mx-auto">
          {header && (
            <div className="mb-6">
              {header}
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
} 