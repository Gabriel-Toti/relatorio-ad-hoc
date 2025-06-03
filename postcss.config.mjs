// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {
      content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}'
      ]
    }
  }
};
