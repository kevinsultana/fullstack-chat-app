import { create } from "zustand";

export const useThemeStore = create((set) => ({
  isDarkMode: false,
  setDarkMode: (value) => {
    set({ isDarkMode: value });
    const html = document.documentElement;
    if (value) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  },
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.isDarkMode;
      const html = document.documentElement;
      if (newMode) {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return { isDarkMode: newMode };
    }),
  initializeTheme: () => {
    const theme = localStorage.getItem("theme");
    const isDark = theme === "dark";
    set({ isDarkMode: isDark });
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  },
}));
