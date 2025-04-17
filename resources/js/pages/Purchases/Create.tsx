import { useState, FormEvent, useEffect, useRef } from 'react'
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
  product_id: number
  name: string
  code: string
  quantity: number
  unit_price: number
  sub_total: number
}

interface CreateProps extends PageProps {
  suppliers: Supplier[]
  reference_no: string
}

export default function Create({ auth, suppliers, reference_no }: CreateProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const quantityRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const { data, setData, post, errors, processing } = useForm({
    reference_no: reference_no,
    supplier_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
    purchase_status: '0', // 0=รออนุมัติ, 1=เสร็จสิ้น
    payment_status: '0', // 0=ยังไม่ชำระ, 1=ชำระบางส่วน, 2=ชำระแล้ว
    paid_amount: 0,
    total_amount: 0,
    purchase_note: '',
    purchase_items: JSON.stringify([])
  })

  const breadcrumbsItems = [
    { title: 'หน้าหลัก', url: route('dashboard') },
    { title: 'รายการสั่งซื้อสินค้าเข้า', url: route('purchases.index') },
    { title: 'เพิ่มรายการใหม่', url: undefined }
  ]

  useEffect(() => {
    // คำนวณยอดรวมทุกครั้งที่รายการสินค้าเปลี่ยนแปลง
    calculateTotal()
  }, [purchaseItems])

  const searchProducts = () => {
    if (!searchTerm) return

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

  const addToCart = (product: Product) => {
    const quantity = quantityRefs.current[product.id]?.value ? parseInt(quantityRefs.current[product.id]?.value || '1', 10) : 1;
    
    // ตรวจสอบว่ามีสินค้านี้ในรายการหรือไม่
    const existingItemIndex = purchaseItems.findIndex(item => item.product_id === product.id)
    
    if (existingItemIndex !== -1) {
      // ถ้ามีแล้ว เพิ่มจำนวน
      const updatedItems = [...purchaseItems]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].sub_total = 
        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unit_price
      
      setPurchaseItems(updatedItems)
    } else {
      // ถ้ายังไม่มี เพิ่มรายการใหม่
      const newItem: PurchaseItem = {
        product_id: product.id,
        name: product.name,
        code: product.code,
        quantity: quantity,
        unit_price: product.unit_price,
        sub_total: quantity * product.unit_price
      }
      
      setPurchaseItems([...purchaseItems, newItem])
    }
    
    // ล้างการค้นหาเมื่อเพิ่มสินค้าแล้ว
    setSearchTerm('')
    setSearchResults([])
  }

  const updateQuantity = (index: number, value: number) => {
    if (value < 1) value = 1
    
    const updatedItems = [...purchaseItems]
    updatedItems[index].quantity = value
    updatedItems[index].sub_total = value * updatedItems[index].unit_price
    
    setPurchaseItems(updatedItems)
  }

  const updateUnitPrice = (index: number, value: number) => {
    if (value < 0) value = 0
    
    const updatedItems = [...purchaseItems]
    updatedItems[index].unit_price = value
    updatedItems[index].sub_total = updatedItems[index].quantity * value
    
    setPurchaseItems(updatedItems)
  }

  const removeItem = (index: number) => {
    const updatedItems = [...purchaseItems]
    updatedItems.splice(index, 1)
    setPurchaseItems(updatedItems)
  }

  const calculateTotal = () => {
    const total = purchaseItems.reduce((sum, item) => sum + item.sub_total, 0)
    setTotalAmount(total)
    setData('total_amount', total)
    setData('purchase_items', JSON.stringify(purchaseItems))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (purchaseItems.length === 0) {
      alert('กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ')
      return
    }
    
    // เตรียมข้อมูลสำหรับส่ง
    setData('purchase_items', JSON.stringify(purchaseItems))
    
    post(route('purchases.store'))
  }

  const handlePriceChange = (index: number, price: number) => {
    const updatedItems = [...purchaseItems];
    updatedItems[index].unit_price = price;
    updatedItems[index].sub_total = price * updatedItems[index].quantity;
    setPurchaseItems(updatedItems);
    calculateTotal();
  }

  const handleQuantityChange = (index: number, qty: number) => {
    const updatedItems = [...purchaseItems];
    updatedItems[index].quantity = qty;
    updatedItems[index].sub_total = updatedItems[index].unit_price * qty;
    setPurchaseItems(updatedItems);
    calculateTotal();
  }

  const isPurchaseEmpty = () => {
    return purchaseItems.length === 0;
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">เพิ่มรายการสั่งซื้อใหม่</h2>
          </div>
        </div>
      }
    >
      <Head title="เพิ่มรายการสั่งซื้อใหม่" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ข้อมูลการสั่งซื้อ</h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="reference_no">
                        เลขที่อ้างอิง <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reference_no"
                        type="text"
                        className={`block w-full p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.reference_no ? 'border-red-500' : ''}`}
                        value={data.reference_no}
                        onChange={(e) => setData('reference_no', e.target.value)}
                        readOnly
                      />
                      {errors.reference_no && <p className="mt-2 text-sm text-red-600">{errors.reference_no}</p>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="supplier_id">
                        ซัพพลายเออร์ <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="supplier_id"
                        className={`block w-full p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.supplier_id ? 'border-red-500' : ''}`}
                        value={data.supplier_id}
                        onChange={(e) => setData('supplier_id', e.target.value)}
                        required
                      >
                        <option value="">เลือกซัพพลายเออร์</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                      </select>
                      {errors.supplier_id && <p className="mt-2 text-sm text-red-600">{errors.supplier_id}</p>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="purchase_date">
                        วันที่สั่งซื้อ <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="purchase_date"
                        type="date"
                        className={`block w-full p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.purchase_date ? 'border-red-500' : ''}`}
                        value={data.purchase_date}
                        onChange={(e) => setData('purchase_date', e.target.value)}
                        required
                      />
                      {errors.purchase_date && <p className="mt-2 text-sm text-red-600">{errors.purchase_date}</p>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="purchase_status">
                        สถานะการสั่งซื้อ <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="purchase_status"
                        className={`block w-full p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.purchase_status ? 'border-red-500' : ''}`}
                        value={data.purchase_status}
                        onChange={(e) => setData('purchase_status', e.target.value)}
                        required
                      >
                        <option value="0">รออนุมัติ</option>
                        <option value="1">เสร็จสิ้น</option>
                      </select>
                      {errors.purchase_status && <p className="mt-2 text-sm text-red-600">{errors.purchase_status}</p>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="payment_status">
                        สถานะการชำระเงิน <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="payment_status"
                        className={`block w-full p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.payment_status ? 'border-red-500' : ''}`}
                        value={data.payment_status}
                        onChange={(e) => setData('payment_status', e.target.value)}
                        required
                      >
                        <option value="0">ยังไม่ชำระ</option>
                        <option value="1">ชำระบางส่วน</option>
                        <option value="2">ชำระแล้ว</option>
                      </select>
                      {errors.payment_status && <p className="mt-2 text-sm text-red-600">{errors.payment_status}</p>}
                    </div>

                    {data.payment_status === '1' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="paid_amount">
                          จำนวนเงินที่ชำระแล้ว <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">฿</span>
                          </div>
                          <input
                            id="paid_amount"
                            type="number"
                            className={`block w-full pl-8 pr-12 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.paid_amount ? 'border-red-500' : ''}`}
                            value={data.paid_amount}
                            onChange={(e) => setData('paid_amount', parseFloat(e.target.value))}
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {errors.paid_amount && <p className="mt-2 text-sm text-red-600">{errors.paid_amount}</p>}
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="purchase_note">
                        หมายเหตุ
                      </label>
                      <textarea
                        id="purchase_note"
                        className={`block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.purchase_note ? 'border-red-500' : ''}`}
                        value={data.purchase_note}
                        onChange={(e) => setData('purchase_note', e.target.value)}
                        rows={3}
                      ></textarea>
                      {errors.purchase_note && <p className="mt-2 text-sm text-red-600">{errors.purchase_note}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-4">
                  <div className="p-6">
                    <div className="border-gray-200 pb-4 mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">รายละเอียดสินค้า</h3>
                    </div>

                    <div className="mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="ค้นหาสินค้า..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={searchProducts}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          ค้นหา
                        </button>
                      </div>
                    </div>

                    {searchResults.length > 0 && (
                      <div className="overflow-x-auto mb-6">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รหัสสินค้า</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ชื่อสินค้า</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคา</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สต็อก</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">จำนวน</th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">เพิ่ม</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {searchResults.map((product) => (
                              <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  ฿{(product.unit_price / 100).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <input
                                    type="number"
                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    min="1"
                                    defaultValue="1"
                                    ref={(el) => {
                                      if (quantityRefs.current) {
                                        quantityRefs.current[product.id] = el;
                                      }
                                    }}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    type="button"
                                    onClick={() => addToCart(product)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    เพิ่ม
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {purchaseItems.length > 0 ? (
                      <div className="overflow-x-auto border rounded-lg mb-6">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รหัสสินค้า</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ชื่อสินค้า</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคาต่อหน่วย</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">จำนวน</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคารวม</th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">ลบ</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {purchaseItems.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  <input
                                    type="number"
                                    className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={item.unit_price / 100}
                                    onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) * 100)}
                                    min="0"
                                    step="0.01"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <input
                                    type="number"
                                    className="w-16 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                    min="1"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  ฿{((item.unit_price * item.quantity) / 100).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    ลบ
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                                ยอดรวม:
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                ฿{(totalAmount / 100).toFixed(2)}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg mb-6 dark:border-gray-600">
                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 0l-8 4m8-4l-8 4m-8-4l8 4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">ไม่มีสินค้า</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">กรุณาค้นหาและเพิ่มสินค้าเพื่อทำรายการสั่งซื้อ</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <Link
                        href={route('purchases.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                      >
                        ยกเลิก
                      </Link>
                      <button
                        type="submit"
                        disabled={processing || isPurchaseEmpty()}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${
                          processing || isPurchaseEmpty()
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:ring-blue-500'
                        }`}
                      >
                        {processing ? 'กำลังบันทึก...' : 'บันทึก'}
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