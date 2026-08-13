/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Clinical, calm palette — avoid generic SaaS blue/purple defaults
        clinic: {
          teal: "#0F6E6E",
          tealDark: "#0A4F4F",
          sand: "#F6F3EC",
          ink: "#1E2A2A",
          coral: "#E0704A",
        },
      },
    },
  },
  plugins: [],
};
