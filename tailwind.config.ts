import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px"
      }
    },
    extend: {
      colors: {
        background: "#050509",
        foreground: "#f9fafb",
        ghost: {
          purple: "#a855f7",
          "purple-soft": "#3b0764"
        }
      },
      borderRadius: {
        "2xl": "1.5rem"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;


