/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#1a1f2e',
                    800: '#242b3d',
                    700: '#2d3548',
                    600: '#3d4556',
                }
            }
        },
    },
    plugins: [],
}
