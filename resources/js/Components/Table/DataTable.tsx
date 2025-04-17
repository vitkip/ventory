import { useState } from 'react'
import { Link } from '@inertiajs/react'

interface Column {
  field: string
  label: string
  sortable?: boolean
  render?: (item: any) => React.ReactNode
  className?: string
}

interface PaginationProps {
  total: number
  currentPage: number
  perPage: number
  links: Array<{ url: string | null; label: string; active: boolean }>
  from: number
  to: number
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  pagination?: PaginationProps
  onSearch?: (value: string) => void
  onPerPageChange?: (value: number) => void
  onSort?: (field: string) => void
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  loading?: boolean
  noDataText?: string
  title?: string
  actions?: React.ReactNode
}

export default function DataTable({
  data,
  columns,
  pagination,
  onSearch,
  onPerPageChange,
  onSort,
  sortField,
  sortDirection = 'asc',
  loading = false,
  noDataText = 'ບໍ່ເຫັນຂໍ້ມູນ',
  title,
  actions,
}: DataTableProps) {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    setPerPage(value)
    if (onPerPageChange) {
      onPerPageChange(value)
    }
  }

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field)
    }
  }

  const renderSortIcon = (field: string) => {
    if (field !== sortField) return null

    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>ສະແດງ</span>
            <select 
              className="block w-20 p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={perPage}
              onChange={handlePerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
            <span>ລາຍການ</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>ຄົ້ນຫາ:</span>
            <input 
              type="text" 
              className="block w-64 p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="relative">
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.sortable ? (
                    <button 
                      onClick={() => handleSort(column.field)}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                    >
                      <span>{column.label}</span>
                      {renderSortIcon(column.field)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                    >
                      {column.render 
                        ? column.render(item) 
                        : item[column.field]
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {noDataText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ສະແດງ <span className="font-medium">{pagination.from}</span>
              ເຖີງ <span className="font-medium">{pagination.to}</span> ຈາກ <span className="font-medium">{pagination.total}</span> รายการ
            </p>

            <div className="flex items-center space-x-1">
              {pagination.links.map((link, index) => (
                <div key={index}>
                  {link.url ? (
                    <Link
                      href={link.url}
                      className={`px-3 py-1 text-sm rounded-md ${
                        link.active
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span
                      className={`px-3 py-1 text-sm rounded-md text-gray-400 dark:text-gray-500 cursor-not-allowed`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 