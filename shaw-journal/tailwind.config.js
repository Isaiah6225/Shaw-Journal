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
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: "2.25rem !important", // Ensure h1 size is enforced
              fontWeight: "bold !important", // Bold font for h1
              color: "#B60D3E !important", // Shaw's primary color
            },
            h2: {
              fontSize: "2rem !important", // Ensure h2 size is enforced
              fontWeight: "semibold !important",
              color: "#B60D3E !important", // Shaw's primary color
            },
            p: {
              color: "#171717 !important", // Custom text color for paragraphs
            },
            a: {
              color: "#B60D3E !important", // Shaw's primary color for links
              textDecoration: "underline !important",
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}


