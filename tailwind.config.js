/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kuka-orange': '#FF8C00',
        'kuka-dark': '#2C2A29',
      }
    },
  },
  plugins: [],
}
