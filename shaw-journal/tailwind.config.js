module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
	'primary',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B60D3E", // Shaw's primary color
        secondary: "#006F3D", // Shaw's secondary color
        background: "#F0F0F0", // Custom background color
        foreground: "#171717", // Custom text color
      },
    },
  },
  plugins: [],
};
