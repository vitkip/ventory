import { FormEvent, useEffect, useState } from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import SelectInput from '@/Components/SelectInput'
import DateInput from '@/Components/DateInput'
import TextArea from '@/Components/TextArea'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface Product {
  id: number
  name: string
  code: string
  selling_price: number
  stock: number
}

interface OrderDetail {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unitcost: number
  total: number
  product: Product
}

interface Order {
  id: number
  invoice_no: string
  customer_id: number
  order_date: string
  payment_type: string
  sub_total: number
  vat: number
  total: number
  pay: number
  due: number
  note: string
  details: OrderDetail[]
}

interface EditProps extends PageProps {
  order: Order
  customers: Customer[]
}

export default function Edit({ auth, order, customers }: EditProps) {
  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการสั่งซื้อ', url: route('orders.index') },
    { title: 'แก้ไขคำสั่งซื้อ', url: undefined }
  ]

  // สร้าง state สำหรับการจัดการข้อมูล
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>(order.details)
  const [subTotal, setSubTotal] = useState<number>(order.sub_total)
  const [vat, setVat] = useState<number>(order.vat)
  const [total, setTotal] = useState<number>(order.total)

  // ฟอร์มสำหรับแก้ไขคำสั่งซื้อ
  const { data, setData, put, processing, errors } = useForm({
    customer_id: order.customer_id.toString(),
    order_date: order.order_date,
    payment_type: order.payment_type,
    pay: order.pay,
    order_details: JSON.stringify(orderDetails),
    sub_total: order.sub_total,
    vat: order.vat,
    total: order.total,
    note: order.note || '',
  })

  // คำนวณราคาทั้งหมดเมื่อรายการสินค้าเปลี่ยนแปลง
  useEffect(() => {
    const subTotalValue = orderDetails.reduce((sum, item) => sum + item.total, 0)
    const vatValue = Math.round(subTotalValue * 0.07)
    const totalValue = subTotalValue + vatValue

    setSubTotal(subTotalValue)
    setVat(vatValue)
    setTotal(totalValue)
  }, [orderDetails])

  // ลบสินค้าออกจากรายการ
  const handleRemoveProduct = (index: number) => {
    const updatedItems = [...orderDetails]
    updatedItems.splice(index, 1)
    setOrderDetails(updatedItems)
  }

  // คำนวณราคาสุทธิ
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })
  }

  // บันทึกคำสั่งซื้อ
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (orderDetails.length === 0) {
      alert('กรุณามีสินค้าอย่างน้อย 1 รายการ')
      return
    }

    const finalPay = typeof data.pay === 'string' ? parseInt(data.pay) : data.pay as number
    if (isNaN(finalPay) || finalPay < 0) {
      alert('กรุณาระบุจำนวนเงินที่ชำระให้ถูกต้อง')
      return
    }

    if (finalPay > total) {
      alert('จำนวนเงินที่ชำระไม่สามารถมากกว่ายอดรวมได้')
      return
    }

    // อัพเดทข้อมูลล่าสุดก่อนส่ง
    setData({
      ...data,
      order_details: JSON.stringify(orderDetails),
      sub_total: subTotal,
      vat: vat,
      total: total
    })

    // ส่งข้อมูลไปบันทึก
    put(route('orders.update', order.id), {
      onSuccess: () => {
        router.visit(route('orders.show', order.id))
      }
    })
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">แก้ไขคำสั่งซื้อ #{order.invoice_no}</h1>
          </div>
        </div>
      }
    >
      <Head title={`แก้ไขคำสั่งซื้อ: ${order.invoice_no}`} />

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">รายการสินค้า</h3>
                  </div>
                  <div className="p-6">
                    <div className="rounded-md bg-blue-50 dark:bg-blue-900 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700 dark:text-blue-200">
                            การแก้ไขคำสั่งซื้อจะไม่สามารถเพิ่มสินค้าได้ แต่สามารถลบสินค้าออกจากรายการได้
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ลำดับ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ชื่อสินค้า</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ราคา</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">จำนวน</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">รวม</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {orderDetails.length > 0 ? (
                            orderDetails.map((detail, index) => (
                              <tr key={detail.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{detail.product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">฿{formatPrice(detail.unitcost)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">{detail.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">฿{formatPrice(detail.total)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                  <button 
                                    type="button"
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    onClick={() => handleRemoveProduct(index)}
                                  >
                                    ลบ
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">ไม่มีรายการสินค้า</td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">รวม</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">฿{formatPrice(subTotal)}</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">ภาษีมูลค่าเพิ่ม 7%</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">฿{formatPrice(vat)}</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100">ยอดรวมทั้งสิ้น</td>
                            <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">฿{formatPrice(total)}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ข้อมูลคำสั่งซื้อ</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <SelectInput
                        id="customer_id"
                        value={data.customer_id}
                        label="ลูกค้า"
                        onChange={(e) => setData('customer_id', e.target.value)}
                        error={errors.customer_id}
                        required
                      >
                        <option value="">-- เลือกลูกค้า --</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                      </SelectInput>
                      <InputError message={errors.customer_id} className="mt-2" />
                    </div>

                    <div>
                      <DateInput
                        id="order_date"
                        value={data.order_date}
                        label="วันที่สั่งซื้อ"
                        onChange={(e) => setData('order_date', e.target.value)}
                        error={errors.order_date}
                        required
                      />
                      <InputError message={errors.order_date} className="mt-2" />
                    </div>

                    <div>
                      <SelectInput
                        id="payment_type"
                        value={data.payment_type}
                        label="ประเภทการชำระเงิน"
                        onChange={(e) => setData('payment_type', e.target.value)}
                        error={errors.payment_type}
                        required
                      >
                        <option value="เงินสด">เงินสด</option>
                        <option value="โอนเงิน">โอนเงิน</option>
                        <option value="บัตรเครดิต">บัตรเครดิต</option>
                        <option value="เครดิต">เครดิต</option>
                      </SelectInput>
                      <InputError message={errors.payment_type} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="pay" value="จำนวนเงินที่ชำระ" />
                      <TextInput
                        id="pay"
                        type="number"
                        value={data.pay}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('pay', parseInt(e.target.value))}
                        max={total}
                        min={0}
                        required
                      />
                      <InputError message={errors.pay} className="mt-2" />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        จำนวนเงินที่ค้างชำระ: ฿{formatPrice(total - (typeof data.pay === 'string' ? parseInt(data.pay || '0') : (data.pay || 0)))}
                      </p>
                    </div>

                    <div>
                      <TextArea
                        id="note"
                        value={data.note}
                        label="หมายเหตุ"
                        onChange={(e) => setData('note', e.target.value)}
                        error={errors.note}
                        rows={2}
                      />
                      <InputError message={errors.note} className="mt-2" />
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-end space-x-3">
                      <Link 
                        href={route('orders.show', order.id)} 
                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                      >
                        ยกเลิก
                      </Link>
                      <button 
                        type="submit" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        disabled={processing || orderDetails.length === 0}
                      >
                        {processing ? 'กำลังบันทึก...' : 'บันทึกคำสั่งซื้อ'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 