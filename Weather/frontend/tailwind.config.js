/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "#F4F1E8",
        brutalBg: "#F4F1E8",
        brutalBlack: "#11110F",
        brutalLime: "#C8FF2E",
        brutalCoral: "#FF5C5C",
        brutalBlue: "#4057FF",
        skyguard: {
          bg: "#F4F1E8",
          card: "#FFFFFF",
          accent: "#C8FF2E",
          primary: "#11110F",
          text: "#11110F",
          muted: "#555550",
          border: "#11110F",
          success: "#C8FF2E",
          warning: "#FF5C5C",
          danger: "#FF5C5C",
          purple: "#4057FF"
        }
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'brutal': '5px 5px 0 #11110F',
        'brutal-lg': '7px 7px 0 #11110F',
        'brutal-sm': '3px 3px 0 #11110F',
        'brutal-hover': '8px 8px 0 #11110F',
        'brutal-active': '2px 2px 0 #11110F',
      }
    },
  },
  plugins: [],
}
