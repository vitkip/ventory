import { Link } from '@inertiajs/react'

interface EmptyStateProps {
  title: string
  message: string
  buttonLabel?: string
  buttonHref?: string
}

export default function EmptyState({ title, message, buttonLabel, buttonHref }: EmptyStateProps) {
  return (
    <div className="container-xl d-flex flex-column justify-content-center align-items-center py-5">
      <div className="empty">
        <div className="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-database-off" width="40" height="40" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12.983 8.978c3.955 -.182 6.017 -1.492 6.017 -2.978c0 -1.909 -3.015 -3.5 -7 -3.5c-2.379 0 -4.5 .524 -5.841 1.339"></path>
            <path d="M4 6c0 1.083 .906 2.068 2.331 2.798"></path>
            <path d="M4 12c0 1.066 .879 2.032 2.25 2.773"></path>
            <path d="M4 18c0 .744 .408 1.446 1.128 2.05"></path>
            <path d="M19 18c0 -1.909 -3.015 -3.5 -7 -3.5c-1.289 0 -2.492 .16 -3.545 .439"></path>
            <path d="M9 12c0 .742 .823 1.42 2.137 1.85"></path>
            <path d="M19 12c0 -1.909 -3.015 -3.5 -7 -3.5c-.363 0 -.72 .014 -1.07 .04"></path>
            <path d="M3 3l18 18"></path>
          </svg>
        </div>
        <p className="empty-title">{title}</p>
        <p className="empty-subtitle text-secondary">
          {message}
        </p>
        <div className="empty-action">
          {buttonLabel && buttonHref && (
            <Link href={buttonHref} className="btn btn-primary">
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
} 