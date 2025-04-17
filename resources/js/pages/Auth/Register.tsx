import { useEffect, FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import TextInput from '@/Components/TextInput'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'

interface RegisterForm {
  name: string
  email: string
  username: string
  password: string
  password_confirmation: string
  'terms-of-service': boolean
  [key: string]: string | boolean
}

export default function Register() {

  // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
  const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    'terms-of-service': false,
  })

  // ฟังก์ชันสำหรับการ reset ข้อมูลฟอร์ม
  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation')
    }
  }, [])

  // ฟังก์ชันสำหรับการ submit ฟอร์ม
  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    
    // ตรวจสอบก่อนส่งข้อมูล
    if (!data['terms-of-service']) {
      setData('terms-of-service', false)
    }
    
    post(route('register'))
  }

  return (
    <GuestLayout>
        <Head>
            <title>Register</title>
            <meta name="description" content="Register page description" />
        </Head>

        <form onSubmit={submit} method='POST'>

        {/* ชื่อ */}
        <div>
          <InputLabel htmlFor="name" value="ชื่อ" />
          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            onChange={(e) => setData('name', e.target.value)}
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* อีเมล */}
        <div className="mt-4">
          <InputLabel htmlFor="email" value="อีเมล" />
          <TextInput
            id="email"
            type="text"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            onChange={(e) => setData('email', e.target.value)}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        {/* ชื่อผู้ใช้งาน */}
        <div className="mt-4">
          <InputLabel htmlFor="username" value="ชื่อผู้ใช้งาน" />
          <TextInput
            id="username"
            type="text"
            name="username"
            value={data.username}
            className="mt-1 block w-full"
            onChange={(e) => setData('username', e.target.value)}
          />
          <InputError message={errors.username} className="mt-2" />
        </div>

        {/* รหัสผ่าน */}
        <div className="mt-4">
          <InputLabel htmlFor="password" value="รหัสผ่าน" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            onChange={(e) => setData('password', e.target.value)}
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password_confirmation" value="ยืนยันรหัสผ่าน" />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            onChange={(e) => setData('password_confirmation', e.target.value)}
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="terms-of-service"
              id="terms-of-service"
              checked={data['terms-of-service'] as boolean}
              onChange={(e) => setData('terms-of-service', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ยอมรับ <a href="/terms-of-service" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                ข้อกำหนดและเงื่อนไขการใช้งาน
              </a>
            </span>
          </label>
          <InputError message={errors['terms-of-service']} className="mt-2" />
        </div>

        <div className="flex items-center justify-end mt-4">
          <Link
            href={route('login')}
            className="text-sm text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
          >
            มีบัญชีอยู่แล้ว?
          </Link>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-4 hover:cursor-pointer"
            disabled={processing}
          >
            ลงทะเบียน
          </button>
        </div>

        </form>
    </GuestLayout>
  )
}
