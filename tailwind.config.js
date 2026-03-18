/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FDFBF7',
                surface: '#FFFFFF',
                primary: {
                    DEFAULT: '#2D5A27', // SAADEE Green
                    dark: '#1B3D18',
                },
                accent: '#C5A059', // Elegant Gold
                card: '#FFFFFF',
                text: '#1A1A1A',
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
