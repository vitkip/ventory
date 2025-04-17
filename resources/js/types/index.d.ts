export interface User {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    username: string
    created_at: string
  }
  
  export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
      user: User
    }
  }
  
  // declare global {
  //   function route(name: string, params?: Record<string, any>, absolute?: boolean): string
  //   var route: (name: string, params?: Record<string, any>, absolute?: boolean) => string
  // } 