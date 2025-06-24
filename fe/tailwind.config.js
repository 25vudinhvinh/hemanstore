/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundColor: (theme) => ({
                ...theme('colors'),
                sidebar: '#EFF5F6',
            }),
        },
    },
    plugins: [],
}
