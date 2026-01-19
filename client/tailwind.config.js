/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}", // Added components path since it sits at client root
        "./*.{js,ts,jsx,tsx}" // Catches App.tsx
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
