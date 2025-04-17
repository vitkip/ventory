export default function Footer() {
    return (
      <footer className="py-4 mt-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
              Copyright &copy; {new Date().getFullYear()}
              <a href="#" className="ml-1 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Bitkip
              </a>
              . All rights reserved.
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Made with
              <svg className="inline-block w-4 h-4 ml-1 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </footer>
    )
  } 