/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ignition: {
          start: '#FF4D2E',
          mid: '#FF8A00',
          end: '#FFC14D',
        },
      },
      fontFamily: {
        heading: ['Archivo', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
