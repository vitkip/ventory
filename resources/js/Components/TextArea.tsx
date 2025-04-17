import React from 'react'
import { TextareaHTMLAttributes } from 'react'
import InputLabel from './InputLabel'
import InputError from './InputError'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  className?: string
}

export default function TextArea({
  label,
  error,
  className = '',
  ...props
}: TextAreaProps) {
  return (
    <>
      {label && <InputLabel value={label} htmlFor={props.id} />}
      <textarea
        {...props}
        className={`mt-1 block p-2 w-full rounded-md border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-gray-100 
          placeholder-gray-500 dark:placeholder-gray-400
          shadow-sm 
          focus:border-blue-500 focus:ring-blue-500 
          dark:focus:border-blue-400 dark:focus:ring-blue-400
          disabled:bg-gray-100 dark:disabled:bg-gray-700
          disabled:text-gray-500 dark:disabled:text-gray-400
          sm:text-sm
          transition-colors duration-200
          resize-none
          ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 dark:focus:border-red-400 dark:focus:ring-red-400' : ''} 
          ${className}`}
      ></textarea>
      {error && <InputError message={error} />}
    </>
  )
} 