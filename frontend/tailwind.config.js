/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
            },
            colors: {
                brand: {
                    dark1: '#051F20',
                    dark2: '#0B2B26',
                    dark3: '#163832',
                    dark4: '#235347',
                    light1: '#8EB69B',
                    light2: '#DAF1DE',
                    warm: '#f5f2ed',
                }
            }
        },
    },
    plugins: [],
}
