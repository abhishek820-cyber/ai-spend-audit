'use client'

import { useDarkMode } from '@/hooks/useDarkMode'

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode()

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low hover:bg-surface-variant transition-all"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}