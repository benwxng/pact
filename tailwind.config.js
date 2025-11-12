/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#666666",
        tertiary: "#999999",
        background: "#FFFFFF",
        card: "#F5F5F5",
        border: "#E5E5E5",
        success: "#22C55E",
        error: "#EF4444",
        warning: "#F59E0B",
      },
    },
  },
  plugins: [],
};

