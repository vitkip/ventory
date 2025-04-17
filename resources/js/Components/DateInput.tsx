import { InputHTMLAttributes } from 'react'
import InputLabel from './InputLabel'
import InputError from './InputError'

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
}

export default function DateInput({
  label,
  error,
  className = '',
  ...props
}: DateInputProps) {
  return (
    <>
      {label && <InputLabel value={label} htmlFor={props.id} />}
      <input
        type="date"
        {...props}
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
      />
      {error && <InputError message={error} />}
    </>
  )
}
