/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        './components/**/*.{vue,js}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
    ],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#EBEFFE',
                    100: '#D8DEFD',
                    200: '#ACB9FB',
                    300: '#8598FA',
                    400: '#5E78F8',
                    500: '#3353F6',
                    600: '#0A2FE6',
                    700: '#0823AB',
                    800: '#051770',
                    900: '#030C3B',
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
