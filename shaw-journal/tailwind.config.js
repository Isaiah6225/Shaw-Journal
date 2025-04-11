module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
	    colors: {
		header:'#800020',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
