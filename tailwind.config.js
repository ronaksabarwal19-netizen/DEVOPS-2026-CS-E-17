/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0F172A',
        card: '#1E293B',
        border: '#334155',
        text: {
          primary: '#F1F5F9',
          secondary: '#E2E8F0',
        },
        primary: '#3B82F6',
        income: '#10B981',
        expense: '#EF4444',
      },
    },
  },
  plugins: [],
}
