export interface User {
    id: number
    name: string
    email: string
    email_verified_at: string
  }
  
  export interface Customer {
    id: number
    name: string
    email: string
    phone: string
    address: string
    photo?: string
    created_at: string
    updated_at: string
  }
  
  export interface Category {
    id: number
    name: string
    slug?: string
    created_at: string
    updated_at: string
  }
  
  export interface Unit {
    id: number
    name: string
    short_name: string
    created_at: string
    updated_at: string
  }
  
  export interface Product {
    id: number
    name: string
    code: string
    category_id: number
    unit_id: number
    buying_price: number
    selling_price: number
    stock: number
    image?: string
    created_at: string
    updated_at: string
    category?: Category
    unit?: Unit
  }
  
  export interface PageProps {
    auth: {
      user: User
    }
  } 