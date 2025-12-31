/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aquí agregaremos tus colores personalizados más adelante
      colors: {
        'game-dark': '#020b1c',
        'game-blue': '#0055ff',
        'game-cyan': '#00ffff',
        'game-gold': '#d4af37',
      }
    },
  },
  plugins: [],
}