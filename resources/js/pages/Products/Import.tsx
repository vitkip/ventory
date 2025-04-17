import { useState, FormEvent, ChangeEvent } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface ImportProps extends PageProps {}

export default function Import({ auth }: ImportProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  
  const { data, setData, post, errors, reset, processing } = useForm({
    file: null as File | null
  })

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setData('file', file)
      setFileName(file.name)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    
    post(route('products.import.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset()
        setFileName('')
        setIsUploading(false)
        router.visit(route('products.index'))
      },
      onError: () => {
        setIsUploading(false)
      }
    })
  }

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการผลิตภัณฑ์', url: route('products.index') },
    { title: 'นำเข้าผลิตภัณฑ์', active: true }
  ]

  return (
    <AuthenticatedLayout 
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ฟอร์ม</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">นำเข้าผลิตภัณฑ์</h2>
          </div>
        </div>
      }
    >
      <Head title="นำเข้าผลิตภัณฑ์" />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">นำเข้าผลิตภัณฑ์</h3>
            </div>
            
            <div className="p-6">
              <div className="p-4 mb-6 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-200">
                <h4 className="font-semibold mb-2">คำแนะนำ:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>ไฟล์ต้องเป็นนามสกุล .xls หรือ .xlsx เท่านั้น</li>
                  <li>ตรวจสอบรูปแบบข้อมูลให้ถูกต้องตามแม่แบบที่กำหนด</li>
                  <li>คอลัมน์ A: ชื่อสินค้า</li>
                  <li>คอลัมน์ B: ID หมวดหมู่</li>
                  <li>คอลัมน์ C: ID หน่วยนับ</li>
                  <li>คอลัมน์ D: รหัสสินค้า</li>
                  <li>คอลัมน์ E: จำนวน</li>
                  <li>คอลัมน์ F: ราคาซื้อ</li>
                  <li>คอลัมน์ G: ราคาขาย</li>
                  <li>คอลัมน์ H: ชื่อรูปภาพ (ถ้ามี)</li>
                </ul>
                <div className="mt-3">
                  <Link
                    href={route('products.export.store')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100 font-medium"
                  >
                    ดาวน์โหลดแม่แบบ Excel
                  </Link>
                </div>
              </div>

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="file">
                    เลือกไฟล์ Excel
                  </label>
                  <div className="flex items-center mt-1">
                    <label className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-500 dark:border-blue-500 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600">
                      <span className="text-sm leading-normal">เลือกไฟล์</span>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        className="hidden"
                        accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      {fileName ? fileName : 'ยังไม่ได้เลือกไฟล์'}
                    </span>
                  </div>
                  {errors.file && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.file}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Link
                    href={route('products.index')}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-md font-medium text-xs text-gray-800 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition ease-in-out duration-150"
                  >
                    ยกเลิก
                  </Link>
                  <button
                    type="submit"
                    disabled={processing || !data.file || isUploading}
                    className={`inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-medium text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                      (processing || !data.file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? 'กำลังนำเข้า...' : 'นำเข้าผลิตภัณฑ์'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 