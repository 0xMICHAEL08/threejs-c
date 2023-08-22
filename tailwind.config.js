/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-liner":
          "linear-gradient(180deg, #08b6f9 0%, #6c56ef 33.57%, #1306dd 65.86%, #aa0eb2 100%)",
      },
      fontFamily: {
        spline: ["Spline Sans", "sans-serif"],
        splinemono: ["Spline Sans Mono", "sans-serif"],
      },
    },
  },
  plugins: [],
};
