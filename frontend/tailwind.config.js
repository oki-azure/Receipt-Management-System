// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#137fec",
                "background-light": "#f6f7f8",
                "background-dark": "#101922",
                "card-light": "#ffffff",
                "card-dark": "#182431",
                success: "#16a34a",
                warning: "#f59e0b",
                danger: "#dc2626",
                "custom-gray": "#617589"
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};