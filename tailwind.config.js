/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lpu: {
          orange: "#F37021",
          darkOrange: "#D95808",
          black: "#1A1A1A",
          charcoal: "#262626",
          cream: "#FFF9F4",
          soft: "#FFF3EB",
          yellow: "#FFD028",
          accent: "#2A9D8F"
        }
      },
      boxShadow: {
        neo: "4px 4px 0px 0px #000000",
        "neo-sm": "2px 2px 0px 0px #000000",
        "neo-lg": "6px 6px 0px 0px #000000",
        "neo-xl": "8px 8px 0px 0px #000000",
        "neo-hover": "2px 2px 0px 0px #000000",
        "neo-orange": "4px 4px 0px 0px #F37021",
      }
    },
  },
  plugins: [],
};
