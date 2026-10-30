import { create } from 'zustand';

// Read saved preference or system preference
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const applyThemeToDOM = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem('theme', theme);
  } catch {}
};

// Initialize DOM immediately
const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

const useThemeStore = create((set, get) => ({
  theme: initialTheme,
  isDark: initialTheme === 'dark',

  toggleTheme: () => {
    const current = get().theme;
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyThemeToDOM(nextTheme);
    set({ theme: nextTheme, isDark: nextTheme === 'dark' });
  },

  setTheme: (theme) => {
    if (theme !== 'dark' && theme !== 'light') return;
    applyThemeToDOM(theme);
    set({ theme, isDark: theme === 'dark' });
  },
}));

export default useThemeStore;
