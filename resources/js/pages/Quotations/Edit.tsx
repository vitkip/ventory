import { useState, useEffect, FormEvent } from 'react'
import { Head, useForm, Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Breadcrumbs from '@/Components/Breadcrumbs'
import TextInput from '@/Components/TextInput'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import SelectInput from '@/Components/SelectInput'
import TextArea from '@/Components/TextArea'

interface Product {
  id: number
  name: string
  code: string
  price: number
  stock: number
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface QuotationItem {
  product_id: number
  product_name: string
  unit_price: number
  quantity: number
  total_price: number
  id?: number
}

interface Quotation {
  id: number
  reference: string
  date: string
  due_date: string
  customer_id: number
  notes: string
  terms: string
  status: number
  total_amount: number
  discount_type: string
  discount_value: number
  discount_amount: number
  tax_rate: number
  tax_amount: number
  grand_total: number
  items: QuotationItem[]
}

interface EditProps extends PageProps {
  quotation: Quotation
  customers: Customer[]
  products: Product[]
}

export default function Edit({ auth, quotation, customers, products }: EditProps) {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<QuotationItem[]>(quotation.items || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [subtotal, setSubtotal] = useState(quotation.total_amount || 0)
  const [taxRate, setTaxRate] = useState(quotation.tax_rate || 7)
  const [taxAmount, setTaxAmount] = useState(quotation.tax_amount || 0)
  const [grandTotal, setGrandTotal] = useState(quotation.grand_total || 0)

  const { data, setData, put, processing, errors } = useForm({
    customer_id: quotation.customer_id.toString(),
    date: quotation.date,
    due_date: quotation.due_date,
    reference: quotation.reference,
    notes: quotation.notes || '',
    terms: quotation.terms || 'ລາຄານີ້ມີຜົນເປັນເວລາ 30 ວັນນັບຈາກວັນທີໃນໃບສະເໜີລາຄາ',
    status: quotation.status.toString(),
    discount_type: quotation.discount_type || 'fixed',
    discount_value: quotation.discount_value.toString() || '0',
    discount_amount: quotation.discount_amount.toString() || '0',
    tax_rate: quotation.tax_rate.toString() || '7',
    tax_amount: quotation.tax_amount.toString() || '0',
    total_amount: quotation.total_amount.toString() || '0',
    grand_total: quotation.grand_total.toString() || '0',
    items: JSON.stringify(items)
  })

  // คำนวณยอดรวมเมื่อรายการสินค้าเปลี่ยนแปลง
  useEffect(() => {
    if (items.length > 0) {
      const calculatedSubtotal = items.reduce((sum, item) => sum + item.total_price, 0)
      setSubtotal(calculatedSubtotal)
      
      const discountAmount = parseFloat(data.discount_amount) || 0
      const calculatedTaxAmount = ((calculatedSubtotal - discountAmount) * taxRate) / 100
      setTaxAmount(calculatedTaxAmount)
      
      const calculatedGrandTotal = calculatedSubtotal - discountAmount + calculatedTaxAmount
      setGrandTotal(calculatedGrandTotal)
      
      // อัปเดตข้อมูลฟอร์ม
      setData({
        ...data,
        total_amount: calculatedSubtotal.toString(),
        tax_amount: calculatedTaxAmount.toString(),
        grand_total: calculatedGrandTotal.toString(),
        items: JSON.stringify(items)
      })
    } else {
      setSubtotal(0)
      setTaxAmount(0)
      setGrandTotal(0)
      
      setData({
        ...data,
        total_amount: '0',
        tax_amount: '0',
        grand_total: '0',
        items: JSON.stringify([])
      })
    }
  }, [items, data.discount_amount, taxRate])

  // คำนวณส่วนลดเมื่อประเภทส่วนลดและมูลค่าเปลี่ยนแปลง
  useEffect(() => {
    let discountAmount = 0
    
    if (data.discount_type === 'percentage') {
      discountAmount = (subtotal * (parseFloat(data.discount_value) || 0)) / 100
    } else {
      discountAmount = parseFloat(data.discount_value) || 0
    }
    
    setData('discount_amount', discountAmount.toString())
  }, [data.discount_type, data.discount_value, subtotal])

  // ค้นหาสินค้า
  const handleSearchProducts = (term: string) => {
    setSearchTerm(term)
    if (term.length > 1) {
      const filtered = products.filter(
        p => p.name.toLowerCase().includes(term.toLowerCase()) || 
             p.code.toLowerCase().includes(term.toLowerCase())
      )
      setSearchResults(filtered.slice(0, 10)) // จำกัดผลลัพธ์ 10 รายการ
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  // เพิ่มสินค้าลงในรายการ
  const handleAddProduct = (product: Product) => {
    const existingItem = items.find(item => item.product_id === product.id)
    
    if (existingItem) {
      // อัปเดตจำนวนและราคารวมสำหรับรายการที่มีอยู่แล้ว
      const updatedItems = items.map(item => {
        if (item.product_id === product.id) {
          const newQuantity = item.quantity + 1
          return {
            ...item,
            quantity: newQuantity,
            total_price: newQuantity * item.unit_price
          }
        }
        return item
      })
      
      setItems(updatedItems)
    } else {
      // เพิ่มรายการใหม่
      const newItem: QuotationItem = {
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: 1,
        total_price: product.price
      }
      
      setItems([...items, newItem])
    }
    
    // ล้างการค้นหา
    setSearchTerm('')
    setShowSearchResults(false)
  }

  // อัปเดตจำนวนสินค้า
  const handleQuantityChange = (index: number, value: number) => {
    if (value <= 0) return // ไม่อนุญาตให้ใส่จำนวนน้อยกว่าหรือเท่ากับศูนย์
    
    const updatedItems = [...items]
    updatedItems[index].quantity = value
    updatedItems[index].total_price = value * updatedItems[index].unit_price
    
    setItems(updatedItems)
  }

  // อัปเดตราคาต่อหน่วย
  const handleUnitPriceChange = (index: number, value: number) => {
    if (value <= 0) return // ไม่อนุญาตให้ใส่ราคาน้อยกว่าหรือเท่ากับศูนย์
    
    const updatedItems = [...items]
    updatedItems[index].unit_price = value
    updatedItems[index].total_price = value * updatedItems[index].quantity
    
    setItems(updatedItems)
  }

  // ลบรายการสินค้า
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items]
    updatedItems.splice(index, 1)
    setItems(updatedItems)
  }

  // อัปเดตใบเสนอราคา
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      alert('ກະລຸນາເພີມສິນຄ້າຢ່າງນ້ອຍ 1 ລາຍການ')
      return
    }
    
    setLoading(true)
    
    put(route('quotations.update', quotation.id), {
      onSuccess: () => {
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
      }
    })
  }

  const breadcrumbsItems = [
    { title: 'ໜ້າຫຼັກ', url: route('dashboard') },
    { title: 'ໃບສະເໜີລາຄາ', url: route('quotations.index') },
    { title: 'ແກ້ໄຂ', url: undefined }
  ]

  // ตรวจสอบว่าสถานะปัจจุบันของใบเสนอราคาอนุญาตให้แก้ไขหรือไม่
  const canEdit = quotation.status !== 2 && quotation.status !== 3

  if (!canEdit) {
    router.visit(route('quotations.show', quotation.id))
    return null
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">ແກ້ໄຂ</div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">ໃບສະເໜີລາຄາ #{quotation.reference}</h2>
          </div>
        </div>
      }
    >
      <Head title={`แก้ไขใบเสนอราคา #${quotation.reference}`} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbsItems} />
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden mb-6">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">ລາຍການສິນຄ້າ</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <InputLabel htmlFor="product_search" value="ค้นหาสินค้า" />
                      <div className="relative">
                        <TextInput
                          id="product_search"
                          className="block w-full mt-1"
                          value={searchTerm}
                          onChange={(e) => handleSearchProducts(e.target.value)}
                          placeholder="ພິມຊື່ລະຫັດສິນຄ້າ"
                          autoComplete="off"
                        />
                        
                        {showSearchResults && searchResults.length > 0 && (
                          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-sm z-50 search-results">
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {searchResults.map(product => (
                                <button
                                  key={product.id}
                                  type="button"
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out"
                                  onClick={() => handleAddProduct(product)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium text-gray-800 dark:text-gray-100">{product.name}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">ລະຫັດ: {product.code}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-gray-800 dark:text-gray-100">₭{(product.price / 100).toLocaleString('th-TH')}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">ຄົງເຫຼື້: {product.stock}</div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {searchTerm && searchResults.length === 0 && showSearchResults && (
                        <div className="text-red-500 mt-1">ບໍ່ເຫັນສິນຄ້າທີ່ຄົ້ນຫາ</div>
                      )}
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ສິນຄ້າ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[140px]">ລາຄາ/ຫົວໜ່ວຍ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[100px]">ຈຳນວນ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[140px]">ຍອດລວມ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[50px]"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {items.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                ຍັງບໍ່ມີລາຍການສິນຄ້າ
                              </td>
                            </tr>
                          ) : (
                            items.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{item.product_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <TextInput
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.unit_price / 100} // แสดงราคาในรูปแบบบาท
                                    onChange={(e) => handleUnitPriceChange(index, parseFloat(e.target.value) * 100)} // แปลงกลับเป็นสตางค์
                                    className="w-full"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <TextInput
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                    className="w-full"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-right">
                                  ₭{(item.total_price / 100).toLocaleString('th-TH')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150"
                                    onClick={() => handleRemoveItem(index)}
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
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">ຂໍ້ມູນໃບສະເໜີລາຄາ</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <InputLabel htmlFor="customer_id" value="ลูกค้า" required />
                      <SelectInput
                        id="customer_id"
                        className="mt-1 block w-full"
                        value={data.customer_id}
                        onChange={(e) => setData('customer_id', e.target.value)}
                      >
                        <option value="">-- ເລືອກລູກຄ້າ --</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </SelectInput>
                      <InputError message={errors.customer_id} className="mt-2" />
                    </div>
                    
                    <div className="mb-4">
                      <InputLabel htmlFor="reference" value="ເລກທີ່ອ້າງອິງ" required />
                      <TextInput
                        id="reference"
                        value={data.reference}
                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-700"
                        onChange={(e) => setData('reference', e.target.value)}
                        readOnly
                      />
                      <InputError message={errors.reference} className="mt-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <InputLabel htmlFor="date" value="ວັນທີ" required />
                        <TextInput
                          id="date"
                          type="date"
                          value={data.date}
                          className="mt-1 block w-full"
                          onChange={(e) => setData('date', e.target.value)}
                        />
                        <InputError message={errors.date} className="mt-2" />
                      </div>
                      <div className="mb-4">
                        <InputLabel htmlFor="due_date" value="ວັນທີໝົດອາຍຸ" required />
                        <TextInput
                          id="due_date"
                          type="date"
                          value={data.due_date}
                          className="mt-1 block w-full"
                          onChange={(e) => setData('due_date', e.target.value)}
                        />
                        <InputError message={errors.due_date} className="mt-2" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <InputLabel htmlFor="status" value="ສະຖານະ" required />
                      <SelectInput
                        id="status"
                        className="mt-1 block w-full"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                      >
                        <option value="0">ຮ່າງ</option>
                        <option value="1">ສົ່ງແລ້ວ</option>
                        <option value="3">ຍົກເລີກ</option>
                      </SelectInput>
                      <InputError message={errors.status} className="mt-2" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">ສ່ວນຫຼຸດພາສີ</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <InputLabel htmlFor="discount_type" value="ประเภทส่วนลด" />
                      <SelectInput
                        id="discount_type"
                        className="mt-1 block w-full"
                        value={data.discount_type}
                        onChange={(e) => setData('discount_type', e.target.value)}
                      >
                        <option value="fixed">ຈຳນວນເງີນ</option>
                        <option value="percentage">ເບີເຊັນ</option>
                      </SelectInput>
                    </div>
                    
                    <div className="mb-4">
                      <InputLabel htmlFor="discount_value" value={`ส่วนลด ${data.discount_type === 'percentage' ? '(%)' : '(฿)'}`} />
                      <TextInput
                        id="discount_value"
                        type="number"
                        min="0"
                        step={data.discount_type === 'percentage' ? '0.01' : '1'}
                        value={data.discount_value}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('discount_value', e.target.value)}
                      />
                      <InputError message={errors.discount_value} className="mt-2" />
                    </div>
                    
                    <div className="mb-4">
                      <InputLabel htmlFor="tax_rate" value="ອັດຕາພາສີມູນຄ່າເພີມ (%)" />
                      <TextInput
                        id="tax_rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={data.tax_rate}
                        className="mt-1 block w-full"
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0
                          setData('tax_rate', e.target.value)
                          setTaxRate(value)
                        }}
                      />
                      <InputError message={errors.tax_rate} className="mt-2" />
                    </div>
                    
                    <div className="py-2 text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">ຍອດລວມ:</span>
                        <span className="text-gray-800 dark:text-gray-200">₭{(subtotal / 100).toLocaleString('th-TH')}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">ສ່ວນຫຼຸດ:</span>
                        <span className="text-gray-800 dark:text-gray-200">-₭{(parseFloat(data.discount_amount) / 100).toLocaleString('th-TH')}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">ພາສີມູນຄ່ເພີມ ({taxRate}%):</span>
                        <span className="text-gray-800 dark:text-gray-200">₭{(taxAmount / 100).toLocaleString('th-TH')}</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-800 dark:text-gray-100">ຍອດລວມສຸດທິ:</span>
                          <span className="text-gray-800 dark:text-gray-100">₭{(grandTotal / 100).toLocaleString('th-TH')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">ໝາຍເຫດແລະເງື່ອນໄຂ</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <InputLabel htmlFor="notes" value="ໝາຍເຫດ" />
                      <TextArea
                        id="notes"
                        className="mt-1 block w-full"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={2}
                      ></TextArea>
                      <InputError message={errors.notes} className="mt-2" />
                    </div>
                    
                    <div className="mb-4">
                      <InputLabel htmlFor="terms" value="ເງື່ອນໄຂແລະຂໍ້ຕົກລົງ" />
                      <TextArea
                        id="terms"
                        className="mt-1 block w-full"
                        value={data.terms}
                        onChange={(e) => setData('terms', e.target.value)}
                        rows={3}
                      ></TextArea>
                      <InputError message={errors.terms} className="mt-2" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    href={route('quotations.show', quotation.id)} 
                    className="inline-flex justify-center items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                  >
                    ຍົກເລີກ
                  </Link>
                  <button 
                    type="submit" 
                    className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25" 
                    disabled={processing || loading}
                  >
                    {processing || loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
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