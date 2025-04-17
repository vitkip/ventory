import '../css/app.css'

import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import { route as routeFn } from 'ziggy-js'

// ประกาศ type สำหรับ Ziggy
declare global {
  const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laventory'

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />)
  },
  progress: {
    color: '#4B5563',
  },
})
