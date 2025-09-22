import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        kevinchat: {
          primary: "#6366f1",
          "primary-content": "#f5f3ff",
          secondary: "#f97316",
          "secondary-content": "#fff7ed",
          accent: "#22d3ee",
          "accent-content": "#052f2d",
          neutral: "#1f2933",
          "neutral-content": "#f3f4f6",
          "base-100": "#f8fafc",
          "base-200": "#eff2f9",
          "base-300": "#dbe2f1",
          "base-content": "#0f172a",
          info: "#0ea5e9",
          success: "#10b981",
          warning: "#fbbf24",
          error: "#ef4444",
        },
      },
      "dark",
    ],
  },
};

export default config;
