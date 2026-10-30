import { Sun, Moon } from 'lucide-react';
import useThemeStore from '@/store/themeStore';

export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const { isDark, toggleTheme } = useThemeStore();

  if (variant === 'switch') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`relative inline-flex h-8 w-16 items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900 ${
          isDark ? 'bg-surface-800 border border-surface-700' : 'bg-surface-200 border border-surface-300'
        } ${className}`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            isDark
              ? 'translate-x-8 bg-brand-600 text-amber-300'
              : 'translate-x-0 bg-white text-surface-700'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-amber-300 stroke-amber-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
        </span>
        <span className="sr-only">Toggle dark mode</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
        isDark
          ? 'text-amber-400 hover:text-amber-300 hover:bg-surface-800/80 border border-surface-800'
          : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 border border-transparent'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300" />
        ) : (
          <Moon className="w-5 h-5 text-surface-600 hover:-rotate-12 transition-transform duration-300" />
        )}
      </div>
    </button>
  );
}
