import { FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'

interface ForgotPasswordForm {
  email: string
  [key: string]: string
}

export default function ForgotPassword({ status }: { status?: string }) {

  // ใช้ useForm hook เพื่อจัดการฟอร์ม
  const { data, setData, post, processing, errors } = useForm<ForgotPasswordForm>({
    email: '',
  })

  // ฟังก์ชันสำหรับ submit ฟอร์ม
  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('password.email'))
  }

  return (
    <GuestLayout>
      <Head title="ลืมรหัสผ่าน" />
      
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ลืมรหัสผ่าน</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ระบุอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน</p>
      </div>

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
          {status}
        </div>
      )}

      <form onSubmit={submit} method="POST">
        <div>
          <InputLabel htmlFor="email" value="อีเมล" />

          <TextInput
            id="email"
            type="text"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            onChange={(e) => setData('email', e.target.value)}
            autoFocus
          />

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="flex items-center justify-between mt-4">
          <Link
            href={route('login')}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>

          <button 
            type="submit" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
            disabled={processing}
          >
            ส่งลิงก์รีเซ็ตรหัสผ่าน
          </button>
        </div>
      </form>
    </GuestLayout>
  )
} 