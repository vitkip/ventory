import { FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'

interface ResetPasswordForm {
  token: string
  email: string
  password: string
  password_confirmation: string
  [key: string]: string
}

export default function ResetPassword({ token, email }: { token: string, email: string }) {
  const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
    token,
    email,
    password: '',
    password_confirmation: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('password.store'))
  }

  return (
    <GuestLayout>
      <Head title="รีเซ็ตรหัสผ่าน" />
      
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">รีเซ็ตรหัสผ่าน</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">กำหนดรหัสผ่านใหม่สำหรับบัญชีของคุณ</p>
      </div>

      <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="email" value="อีเมล" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            onChange={(e) => setData('email', e.target.value)}
            required
            autoComplete="username"
            readOnly
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="รหัสผ่านใหม่" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData('password', e.target.value)}
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password_confirmation" value="ยืนยันรหัสผ่านใหม่" />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
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
            รีเซ็ตรหัสผ่าน
          </button>
        </div>
      </form>
    </GuestLayout>
  )
} 