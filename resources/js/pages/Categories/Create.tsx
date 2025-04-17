import { useState } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'
import InputError from '@/Components/InputError'

export default function Create({ auth }: PageProps) {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    slug: '',
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setData('name', name)
    // สร้าง slug อัตโนมัติจากชื่อ
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
    setData('slug', slug)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('categories.store'))
  }

  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ໝວດໝູ່', url: route('categories.index') },
    { title: 'ເພີ່ມໝວດໝູ່ໃໝ່', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">ເພີ່ມລາຍການ</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ໝວດໝູ່ໃໝ່
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <Head title="ເພີມໝວດໝູ່ໃໝ່" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <div className="flex justify-center">
            <div className="w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ລາຍລະອຽດໝວດໝູ່</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                        ຊື່ໝວດໝູ່ <span className="text-red-500">*</span>
                      </label>
                      <input 
                        id="name"
                        type="text" 
                        className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        value={data.name}
                        onChange={handleNameChange}
                        placeholder="ກອກຊື່ໝວດໝູ່" 
                      />
                      <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                      <label className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-1" htmlFor="slug">
                        Slug <span className="text-red-500">*</span>
                      </label>
                      <input 
                        id="slug"
                        type="text" 
                        className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        placeholder="ກອກ slug" 
                      />
                      <InputError message={errors.slug} className="mt-2" />
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex items-center justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href={route('categories.index')} 
                      className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                      ຍົກເລີກ
                    </Link>
                    <button 
                      type="submit" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150" 
                      disabled={processing}
                    >
                      {processing ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກຂໍ້ມູນ'}
                    </button>
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