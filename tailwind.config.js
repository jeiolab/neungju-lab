/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1132d4",
        "background-light": "#f6f6f8",
        "background-dark": "#000000",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"],
        'mono-tech': ['Share Tech Mono', 'monospace'],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}

