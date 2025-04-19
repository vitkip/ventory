import { useEffect, FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'

export default function VerifyEmail() {
    return (
        <GuestLayout>
            <Head>
                <title>ຍືນຍັນອີເມລຂອງເຈົ້າ</title>
                <meta name="description" content="VerifyEmail email page description" />
            </Head>

            <div className="mb-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ຍືນຍັນອີເມລຂອງເຈົ້າ</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"> ຂອບໃຈສຳລັບການລົງທະບຽນ! ກ່ອນເລີ່ມໃຊ້ງານ ກະລຸນາຍືນຍັນອີເມລຂອງທ່ານ ໂດຍກົດລິງທີ່ເຮົາສົ່ງໄປ ຫາທາງອີເມລ ຫາກຍັງບໍ່ໄດ້ຮັບອີເມລ ຈະສົ່ງອີກສະບັບໃຫ້ເຈົ້າ</p>
            </div>

            <form>
                <div className="mt-4 flex items-center justify-between">
                    <button 
                        type="submit" 
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 hover:cursor-pointer"
                    >
                       ສົ່ງອີເມລຍືນຍັນອີກຄັ້ງ
                    </button>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        type="button"
                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:cursor-pointer"
                    >
                        ອອກຈາລະບົບ
                    </Link>
                </div>
            </form>
        </GuestLayout>
    )
}