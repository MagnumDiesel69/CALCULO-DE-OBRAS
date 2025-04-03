/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {primario: '#1E3A8A',
      secundario: '#FBBF24',
      fondo: '#F9FAFB',
      texto: '#1F2937',
      borde: '#D1D5DB',
      exito: '#10B981',
      error: '#EF4444'},
  },
  plugins: [],
}

