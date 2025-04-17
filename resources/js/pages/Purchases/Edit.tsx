import { useState, FormEvent, useEffect } from 'react'
import { Head, useForm, Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'

interface Supplier {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  code: string
  image: string | null
  unit_price: number
  quantity: number
}

interface PurchaseItem {
  id?: number
  product_id: number
  name: string
  code: string
  quantity: number
  unit_price: number
  sub_total: number
}

interface PurchaseDetail {
  id: number
  purchase_id: number
  product_id: number
  quantity: number
  unit_price: number
  sub_total: number
  product: {
    id: number
    name: string
    code: string
  }
}

interface Purchase {
  id: number
  reference_no: string
  supplier_id: number
  purchase_date: string
  total_amount: number
  paid_amount: number
  due_amount: number
  purchase_status: {
    value: number
    label: string
  }
  payment_status: {
    value: number
    label: string
  }
  purchase_note: string
  created_at: string
  supplier: Supplier
  details: PurchaseDetail[]
}

interface EditProps extends PageProps {
  purchase: Purchase
  suppliers: Supplier[]
}

export default function Edit({ auth, purchase, suppliers }: EditProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
  const [totalAmount, setTotalAmount] = useState(purchase.total_amount / 100)

  // แปลง purchase.details เป็น purchaseItems
  useEffect(() => {
    const items = purchase.details.map(detail => ({
      id: detail.id,
      product_id: detail.product_id,
      name: detail.product.name,
      code: detail.product.code,
      quantity: detail.quantity,
      unit_price: detail.unit_price / 100,
      sub_total: detail.sub_total / 100
    }))
    
    setPurchaseItems(items)
  }, [purchase.details])

  const { data, setData, put, errors, processing } = useForm({
    reference_no: purchase.reference_no,
    supplier_id: purchase.supplier_id.toString(),
    purchase_date: purchase.purchase_date 
      ? new Date(purchase.purchase_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    purchase_status: purchase.purchase_status && typeof purchase.purchase_status === 'object'
      ? String(purchase.purchase_status.value)
      : '0',
    payment_status: purchase.payment_status && typeof purchase.payment_status === 'object'
      ? String(purchase.payment_status.value)
      : '0',
    paid_amount: purchase.paid_amount / 100,
    total_amount: purchase.total_amount / 100,
    purchase_note: purchase.purchase_note || '',
    purchase_items: JSON.stringify(purchaseItems)
  })

  // ค้นหาสินค้า
  const searchProducts = () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    
    // เรียกใช้ API โดยตรงแทนการใช้ Inertia router
    fetch(`/api/search/products?term=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data || [])
        setIsSearching(false)
      })
      .catch(error => {
        console.error('Error searching products:', error)
        setIsSearching(false)
      })
  }

  // เพิ่มสินค้าลงตะกร้า
  const addToCart = (product: Product) => {
    // ตรวจสอบว่ามีสินค้านี้ในตะกร้าแล้วหรือไม่
    const existingItemIndex = purchaseItems.findIndex(
      item => item.product_id === product.id
    )
    
    if (existingItemIndex !== -1) {
      // หากมีสินค้าอยู่แล้ว เพิ่มจำนวน
      const updatedItems = [...purchaseItems]
      updatedItems[existingItemIndex].quantity += 1
      updatedItems[existingItemIndex].sub_total = 
        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unit_price
      
      setPurchaseItems(updatedItems)
    } else {
      // หากยังไม่มีสินค้า เพิ่มสินค้าใหม่
      const newItem: PurchaseItem = {
        product_id: product.id,
        name: product.name,
        code: product.code,
        quantity: 1,
        unit_price: product.unit_price / 100,
        sub_total: product.unit_price / 100
      }
      
      setPurchaseItems([...purchaseItems, newItem])
    }
    
    // ล้างผลการค้นหา
    setSearchTerm('')
    setSearchResults([])
  }

  // อัปเดตจำนวนสินค้า
  const updateQuantity = (index: number, value: number) => {
    const updatedItems = [...purchaseItems]
    updatedItems[index].quantity = value
    updatedItems[index].sub_total = value * updatedItems[index].unit_price
    
    setPurchaseItems(updatedItems)
  }

  // อัปเดตราคาต่อหน่วย
  const updateUnitPrice = (index: number, value: number) => {
    const updatedItems = [...purchaseItems]
    updatedItems[index].unit_price = value
    updatedItems[index].sub_total = value * updatedItems[index].quantity
    
    setPurchaseItems(updatedItems)
  }

  // ลบสินค้าออกจากตะกร้า
  const removeItem = (index: number) => {
    const updatedItems = purchaseItems.filter((_, i) => i !== index)
    setPurchaseItems(updatedItems)
  }

  // คำนวณยอดรวม
  const calculateTotal = () => {
    return purchaseItems.reduce((total, item) => total + item.sub_total, 0)
  }

  // เมื่อมีการเปลี่ยนแปลงราคารวม
  useEffect(() => {
    const total = calculateTotal()
    setTotalAmount(total)
    setData('total_amount', total)
    
    // อัปเดต purchase_items ในฟอร์ม
    setData('purchase_items', JSON.stringify(purchaseItems))
  }, [purchaseItems])

  // ผูกค่า paid_amount กับ payment_status
  useEffect(() => {
    const paid = parseFloat(data.paid_amount as any || 0)
    
    if (paid <= 0) {
      setData('payment_status', '0') // ยังไม่ชำระ
    } else if (paid < totalAmount) {
      setData('payment_status', '1') // ชำระบางส่วน
    } else {
      setData('payment_status', '2') // ชำระแล้ว
    }
  }, [data.paid_amount, totalAmount])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // ตรวจสอบว่ามีสินค้าในรายการหรือไม่
    if (purchaseItems.length === 0) {
      alert('กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ')
      return
    }
    
    put(route('purchases.update', purchase.id))
  }

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการสั่งซื้อ', url: route('purchases.index') },
    { title: purchase.reference_no ? purchase.reference_no : 'รายการสั่งซื้อ', url: route('purchases.show', purchase.id) },
    { title: 'แก้ไขรายการสั่งซื้อ', url: undefined }
  ]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">แก้ไขรายการสั่งซื้อ</h2>
          </div>
        </div>
      }
    >
      <Head title={`แก้ไขรายการสั่งซื้อ: ${purchase.reference_no || 'รายการสั่งซื้อ'}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">สินค้า</h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex">
                        <input
                          type="text"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                          placeholder="ค้นหาสินค้าด้วยชื่อหรือรหัส"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="inline-flex ml-2 justify-center items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                          onClick={searchProducts}
                          disabled={isSearching}
                        >
                          {isSearching ? 'กำลังค้นหา...' : 'ค้นหา'}
                        </button>
                      </div>
                      
                      {searchResults.length > 0 && (
                        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {searchResults.map((product) => (
                              <button
                                key={product.id}
                                type="button"
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center focus:outline-none"
                                onClick={() => addToCart(product)}
                              >
                                <div>
                                  <span className="font-medium">{product.name}</span>
                                  <span className="ml-2 text-gray-500 dark:text-gray-400">({product.code})</span>
                                </div>
                                <div className="flex space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                    ฿{(product.unit_price / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    คงเหลือ: {product.quantity}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">สินค้า</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">จำนวน</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">ราคา/หน่วย</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">รวม</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {purchaseItems.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center">
                                <div className="text-gray-500 dark:text-gray-400">ยังไม่มีสินค้าในรายการ ค้นหาและเพิ่มสินค้า</div>
                              </td>
                            </tr>
                          ) : (
                            purchaseItems.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{item.code}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    type="number"
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">฿</span>
                                    <input
                                      type="number"
                                      className="block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                                      min="0.01"
                                      step="0.01"
                                      value={item.unit_price}
                                      onChange={(e) => updateUnitPrice(index, parseFloat(e.target.value))}
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  ฿{item.sub_total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    type="button"
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    onClick={() => removeItem(index)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M18 6l-12 12" />
                                      <path d="M6 6l12 12" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">ยอดรวมทั้งสิ้น:</th>
                            <th colSpan={2} className="px-6 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">฿{totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ข้อมูลทั่วไป</h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="reference_no">เลขที่อ้างอิง</label>
                      <input
                        id="reference_no"
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                        value={data.reference_no}
                        onChange={(e) => setData('reference_no', e.target.value)}
                        readOnly
                      />
                      {errors.reference_no && <div className="text-red-500 text-xs mt-1">{errors.reference_no}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="supplier_id">ซัพพลายเออร์</label>
                      <select
                        id="supplier_id"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm disabled:opacity-50"
                        value={data.supplier_id}
                        onChange={(e) => setData('supplier_id', e.target.value)}
                        disabled // ไม่อนุญาตให้เปลี่ยนซัพพลายเออร์เมื่อแก้ไข
                      >
                        <option value="">เลือกซัพพลายเออร์</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                      {errors.supplier_id && <div className="text-red-500 text-xs mt-1">{errors.supplier_id}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="purchase_date">วันที่สั่งซื้อ</label>
                      <input
                        id="purchase_date"
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                        value={data.purchase_date}
                        onChange={(e) => setData('purchase_date', e.target.value)}
                      />
                      {errors.purchase_date && <div className="text-red-500 text-xs mt-1">{errors.purchase_date}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="purchase_status">สถานะการสั่งซื้อ</label>
                      <select
                        id="purchase_status"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                        value={data.purchase_status}
                        onChange={(e) => setData('purchase_status', e.target.value)}
                      >
                        <option value="0">รออนุมัติ</option>
                        <option value="1">เสร็จสิ้น</option>
                      </select>
                      {errors.purchase_status && <div className="text-red-500 text-xs mt-1">{errors.purchase_status}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="payment_status">สถานะการชำระเงิน</label>
                      <select
                        id="payment_status"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm disabled:opacity-50"
                        value={data.payment_status}
                        disabled
                      >
                        <option value="0">ยังไม่ชำระ</option>
                        <option value="1">ชำระบางส่วน</option>
                        <option value="2">ชำระแล้ว</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">สถานะการชำระเงินจะเปลี่ยนแปลงอัตโนมัติตามยอดเงินที่ชำระ</p>
                      {errors.payment_status && <div className="text-red-500 text-xs mt-1">{errors.payment_status}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="paid_amount">ยอดเงินที่ชำระแล้ว</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">฿</span>
                        <input
                          id="paid_amount"
                          type="number"
                          className="block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                          value={data.paid_amount}
                          onChange={(e) => setData('paid_amount', parseFloat(e.target.value) || 0)}
                          min="0"
                          max={totalAmount}
                          step="0.01"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">ยอดรวมทั้งสิ้น: ฿{totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
                      {errors.paid_amount && <div className="text-red-500 text-xs mt-1">{errors.paid_amount}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="purchase_note">หมายเหตุ</label>
                      <textarea
                        id="purchase_note"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                        value={data.purchase_note}
                        onChange={(e) => setData('purchase_note', e.target.value)}
                        rows={3}
                      ></textarea>
                      {errors.purchase_note && <div className="text-red-500 text-xs mt-1">{errors.purchase_note}</div>}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link 
                    href={route('purchases.show', purchase.id)} 
                    className="inline-flex justify-center items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 flex-1"
                  >
                    ยกเลิก
                  </Link>
                  <button 
                    type="submit" 
                    className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25 flex-1"
                    disabled={processing}
                  >
                    {processing ? 'กำลังบันทึก...' : 'บันทึกรายการ'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 