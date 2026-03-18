/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0b',
                surface: '#161618',
                primary: {
                    DEFAULT: '#3b82f6',
                    dark: '#2563eb',
                },
                accent: '#8b5cf6',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    'from': { boxShadow: '0 0 5px #3b82f6' },
                    'to': { boxShadow: '0 0 20px #3b82f6' },
                }
            }
        },
    },
    plugins: [],
}
