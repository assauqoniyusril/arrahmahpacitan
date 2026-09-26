import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17132b",
        paper: "#ffffff",
        signal: "#6d4aff",
        signalDark: "#5736e8",
      },
      fontFamily: {
        display: ["Manrope", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        editorial: "0 24px 80px rgba(74, 47, 148, 0.14)",
      },
    },
  },
  plugins: [typography],
};
