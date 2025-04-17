import React from 'react'
import { ReactNode, SelectHTMLAttributes } from 'react'
import InputLabel from './InputLabel'
import InputError from './InputError'

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  className?: string
  children: ReactNode
}

export default function SelectInput({
  label,
  error,
  className = '',
  children,
  ...props
}: SelectInputProps) {
  return (
    <>
      {label && <InputLabel value={label} htmlFor={props.id} />}
      <select
        {...props}
        className={`mt-1 block p-2 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
          error ? 'border-red-500 dark:border-red-500' : ''
        } ${className}`}
      >
        {children}
      </select>
      {error && <InputError message={error} />}
    </>
  )
}
